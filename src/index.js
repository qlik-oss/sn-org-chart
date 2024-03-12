import {
  useConstraints,
  useEffect,
  useElement,
  useMemo,
  useModel,
  useOptions,
  usePromise,
  useRect,
  useStaleLayout,
  useState,
  useTheme,
  useTranslator,
} from "@nebula.js/stardust";
import { themeService as createThemeService } from "qlik-chart-modules";
import data from "./data";
import ext from "./extension/ext";
import autoRegister from "./locale/src/translations";
import createStyleModel from "./models/style-model";
import properties from "./object-properties";
import selectionHandler from "./selections-handler";
import snapshot from "./snapshot";
import "./styles/home-button.less";
import "./styles/nodes.less";
import "./styles/paths.less";
import "./styles/tooltip.less";
import "./styles/warnings.less";
import { createContainer, paintTree } from "./tree/render";
import { applyTransform, getSnapshotZoom } from "./tree/transform";
import stylingUtils from "./utils/styling";
import treeTransform from "./utils/tree-utils";
import viewStateUtil from "./utils/viewstate-utils";

export default function supernova(env) {
  const { flags } = env;
  return {
    qae: {
      properties,
      data,
    },
    component: () => {
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const Theme = useTheme();
      const options = useOptions();
      const rect = useRect();
      const constraints = useConstraints();
      const translator = useTranslator();
      const [containerData, setContainerData] = useState(null);
      const [styling, setStyling] = useState(null);
      const [expandedState, setExpandedState] = useState(null);
      const [transform, setTransform] = useState(null);
      const [initialZoom, setInitialZoom] = useState(null);
      const [wrapperState] = useState({
        transform: {},
        constraints,
        expandedState,
      });
      const selectionObj = selectionHandler(translator);

      useMemo(() => {
        autoRegister(translator);
      }, [element, translator.language()]);

      useEffect(() => {
        wrapperState.constraints = constraints;
      }, [constraints]);

      useEffect(() => {
        wrapperState.transform = transform;
      }, [transform]);

      useEffect(() => {
        wrapperState.expandedState = expandedState;
      }, [expandedState]);

      const setExpandedCallback = (newExpandedState) => {
        newExpandedState.useTransitions = true;
        setExpandedState(newExpandedState);
      };

      // Get and transform the data into a tree structure, get styling, reset active selections
      const [dataTree] = usePromise(() => {
        if (!layout) {
          return Promise.resolve();
        }

        const themeService = createThemeService({
          theme: Theme,
          config: {
            id: "orgChart",
          },
        });

        const styleModel = createStyleModel({ layout, themeService, flags });

        const viewState = viewStateUtil.getViewState(options, layout);
        viewState && viewState.expandedState && setExpandedState(viewState.expandedState);
        viewState && viewState.transform && setTransform(viewState.transform);

        return treeTransform({ layout, model, translator }).then((transformed) => {
          setStyling(stylingUtils.cardStyling({ Theme, layout, styleModel }));
          selectionObj.setState([]);
          // Resolving the promise to indicate readiness for printing
          return transformed;
        });
      }, [layout, model, translator.language(), Theme.name()]);

      // Create d3 elements, calculate initial zoom and sets expandedState
      const fullReload = () => {
        if (element && dataTree && styling) {
          const viewState = viewStateUtil.getViewState(options, layout);
          createContainer({
            element,
            dataTree,
            viewState,
            wrapperState,
            selectionObj,
            setInitialZoom,
            setTransform,
            setExpandedState,
            setContainerData,
            layout,
            styling,
          });
        }
      };

      // Call paintTree, currenly repaints all current nodes
      const rePaint = () => {
        if (containerData && expandedState && styling) {
          paintTree({
            containerData,
            styling,
            setExpandedCallback,
            wrapperState,
            selectionObj,
            useTransitions: expandedState.useTransitions,
            element,
            flags,
          });
        }
      };

      useEffect(() => {
        rePaint();
      }, [containerData, selectionObj.state]);

      useEffect(() => {
        fullReload();
      }, [element, dataTree, constraints]);

      useEffect(() => {
        if (layout.resizeOnExpand) {
          fullReload();
        } else {
          rePaint();
        }
      }, [expandedState]);

      // Updates snapshot when resizing
      useEffect(() => {
        if (containerData && layout && layout.snapshotData) {
          const snapshotZoom = getSnapshotZoom(rect, layout.snapshotData.viewState, transform);
          applyTransform(snapshotZoom, containerData.svg, containerData.divBox, rect.width, rect.height, true);
          containerData.divBox.classed("sn-org-chart-snapshot", true);
        }
      }, [rect, containerData]);

      snapshot(expandedState, containerData, layout, transform, initialZoom);
    },
    ext: ext(env),
  };
}

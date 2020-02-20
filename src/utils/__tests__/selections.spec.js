import selections from '../selections';
import defaultValues from '../../__tests__/default-orgchart-props';


describe('selections', () => {
  describe('select', () => {
    const { select } = selections;
    let node;
    let selectionObj;
    let selectionState;
    let isActive;
    beforeEach(() => {
      node = JSON.parse(JSON.stringify(defaultValues.nodes));
      isActive = false;
      selectionObj = {
        api: {
          isActive: () => isActive,
          clear: sinon.spy(),
          select: sinon.spy(),
          begin: sinon.spy(),
        },
        linked: false,
        setState: sinon.spy(),
      };
      selectionState = [];
    });
    it('should early return if elemNo is negative', () => {
      node.data.elemNo = -2;
      select(node, selectionObj, selectionState);
      expect(selectionObj.setState).to.not.have.been.called;
    });
    it('should early return if elemNo is negative', () => {
      node.data.isLocked = true;
      select(node, selectionObj, selectionState);
      expect(selectionObj.setState).to.not.have.been.called;
    });
    it('should call begin sand setState to node id', () => {
      select(node, selectionObj, selectionState);
      expect(selectionObj.api.begin).to.have.been.calledOnce;
      expect(selectionObj.api.select).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([1]);
    });
    it('should not call begin and push node id to selectionState', () => {
      isActive = true;
      selectionState.push(2);
      select(node, selectionObj, selectionState);
      expect(selectionObj.api.begin).to.not.have.been.called;
      expect(selectionObj.api.select).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([2, 1]);
    });
    it('should get all children when linked is true', () => {
      selectionObj.linked = true;
      select(node, selectionObj, selectionState);
      expect(selectionObj.api.select).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([1, 2, 3, 798, 88]);
    });

    it('should deselect when pressing a selected node', () => {
      isActive = true;
      selectionState.push(1);
      select(node, selectionObj, selectionState);
      expect(selectionObj.api.clear).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([]);
    });
  });
});

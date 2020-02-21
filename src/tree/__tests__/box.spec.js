/* eslint-disable prefer-destructuring */
import { getSign, getNewState, getNewUpState } from '../box';
import defaultValues from '../../__tests__/default-orgchart-props';

describe('box', () => {
  let d;
  let expandedState;
  let expectedState;

  describe('getSign', () => {
    beforeEach(() => {
      d = JSON.parse(JSON.stringify(defaultValues.nodes));
      expandedState = {
        topId: '1',
        isExpanded: true,
        expandedChildren: [],
      };
    });
    it('should return - when d is the top node and is expanded', () => {
      expect(getSign(d, expandedState, [])).to.equal('-');
    });
    it('should return - when d is the child of the top node and is expanded', () => {
      d = d.children[0];
      expandedState.expandedChildren.push('2');
      expect(getSign(d, expandedState, [])).to.equal('-');
    });
    it('should return + not expanded', () => {
      expandedState.isExpanded = false;
      expect(getSign(d, expandedState, [])).to.equal('+');
    });
    it('should return - not expanded when in ancestor IDs', () => {
      expandedState.isExpanded = false;
      d = { data: { id: '1982' } };
      expect(getSign(d, expandedState, ['1982'])).to.equal('-');
    });
  });

  describe('getNewState', () => {
    beforeEach(() => {
      d = JSON.parse(JSON.stringify(defaultValues.nodes));
      expandedState = {
        topId: '1',
        isExpanded: true,
        expandedChildren: ['2'],
      };
      expectedState = {
        topId: '1',
        isExpanded: true,
        expandedChildren: [],
      };
    });
    it('should return state with same id, toggled isExpanded and no expanded children', () => {
      expectedState.isExpanded = false;
      expect(getNewState(d, expandedState, [])).to.deep.equal(expectedState);
    });
    it('should return state with same id, isExpanded true and no expanded children', () => {
      d = d.children[0];
      expect(getNewState(d, expandedState, [])).to.deep.equal(expectedState);
    });
    it('should return state with same id, isExpanded true and added expanded child', () => {
      d = d.children[1];
      d.parent.children[0].children = undefined;
      expectedState.expandedChildren = ['2', '4'];
      expect(getNewState(d, expandedState, [])).to.deep.equal(expectedState);
    });
    it('should return state with same id, isExpanded true and added expanded child - even when one sibling has grend children', () => {
      expandedState.expandedChildren = ['4'];
      d.children.push({
        data: {
          id: '10',
          elemNo: 99,
        },
        parent: {
          data: {
            id: '1',
          },
          children: [
            {
              data: {
                id: '2',
              },
            },
          ],
        },
      });
      d = d.children[2];
      expectedState.expandedChildren = ['4', '10'];
      expect(getNewState(d, expandedState, [])).to.deep.equal(expectedState);
    });
    it('should return state with same id, isExpanded true and swapped expaneded child', () => {
      d = d.children[1];
      expectedState.expandedChildren = ['4'];
      expect(getNewState(d, expandedState, [])).to.deep.equal(expectedState);
    });
    it('should return state with new id, isExpanded true and clicked node as expanded', () => {
      d = d.children[0].children[0];
      expectedState.topId = '2';
      expectedState.expandedChildren = ['3'];
      expect(getNewState(d, expandedState, [])).to.deep.equal(expectedState);
    });
    it('should return ancestor state', () => {
      expectedState.topId = '777';
      expectedState.isExpanded = false;
      d = { data: { id: '777' } };
      expect(getNewState(d, expandedState, ['777'])).to.deep.equal(expectedState);
    });

    it('should return parent of ancestor state', () => {
      expectedState.topId = '888';
      d = { data: { id: '777' }, parent: { data: { id: '888' } } };
      expect(getNewState(d, expandedState, ['777', '888'])).to.deep.equal(expectedState);
    });
  });

  describe('getNewUpState', () => {
    let isExpanded;
    beforeEach(() => {
      d = JSON.parse(JSON.stringify(defaultValues.nodes.children[0]));
      isExpanded = true;
      expectedState = {
        topId: '1',
        expandedChildren: ['2'],
        isExpanded: true,
      };
    });
    it('should return expanded state with expanded previous top node', () => {
      expect(getNewUpState(d, isExpanded)).to.deep.equal(expectedState);
    });
    it('should return expanded state with no expanded children', () => {
      isExpanded = false;
      expectedState.expandedChildren = [];
      expect(getNewUpState(d, isExpanded)).to.deep.equal(expectedState);
    });
  });
});

import selections from '../selections';
import defaultValues from '../../__tests__/default-orgchart-props';

describe('selections', () => {
  describe('select', () => {
    const { select } = selections;
    let node;
    let selectionObj;
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
        state: [],
      };
    });
    it('should not run anyhing if api or is undefined', () => {
      node = undefined;
      select(node, selectionObj);
      expect(selectionObj.setState).to.not.have.been.called;
    });
    it('should early return if elemNo is negative', () => {
      node.data.elemNo = -2;
      select(node, selectionObj);
      expect(selectionObj.setState).to.not.have.been.called;
    });
    it('should early return if elemNo isLocked is true', () => {
      node.data.isLocked = true;
      select(node, selectionObj);
      expect(selectionObj.setState).to.not.have.been.called;
    });
    it('should call begin and setState to node id', () => {
      select(node, selectionObj);
      expect(selectionObj.api.begin).to.have.been.calledOnce;
      expect(selectionObj.api.select).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([1]);
    });
    it('should not call begin and push node id to selectionState', () => {
      isActive = true;
      selectionObj.state.push(2);
      select(node, selectionObj);
      expect(selectionObj.api.begin).to.not.have.been.called;
      expect(selectionObj.api.select).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([2, 1]);
    });
    it('should get all children when linked is true', () => {
      selectionObj.linked = true;
      select(node, selectionObj);
      expect(selectionObj.api.select).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([1, 2, 3, 798, 88]);
    });
    it('should deselect node', () => {
      isActive = true;
      selectionObj.state = [1, 2];
      select(node, selectionObj);
      expect(selectionObj.setState).to.have.been.calledWith([2]);
    });
    it('should deselect node and children', () => {
      isActive = true;
      selectionObj.linked = true;
      selectionObj.state = [1, 2];
      select(node, selectionObj);
      expect(selectionObj.api.clear).to.have.been.calledOnce;
      expect(selectionObj.setState).to.have.been.calledWith([]);
    });
  });
});

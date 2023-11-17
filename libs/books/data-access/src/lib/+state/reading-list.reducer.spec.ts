import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Reading list reducer', () => {
  describe('Validate Reading list actions', () => {
    let state: State;
    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('Should display reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });
      const result: State = reducer(initialState, action);
      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });
    
    it('should update state with error message and undo book addition to the reading list', () => {
      const error = 'Failed to add book to the reading list';
      const action = ReadingListActions.failedAddToReadingList({
        error
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B']);
      expect(result.error).toEqual(error);
    });
    it('should add books to the reading list', () => {
      const action = ReadingListActions.addToReadingList({
        book: createBook('C')
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('should confirmedRemoveFromReadingList from the reading list', () => {
      const action = ReadingListActions.removeFromReadingList({
        item: createReadingListItem('B')
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A']);
    });
    it('should confirm Add To ReadingList  ', () => {
      const action = ReadingListActions.confirmedAddToReadingList({
        book: createBook('C'),
        showSnackBar: true
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B']);
    });

    it('should confirm Remove From ReadingList', () => {
      const action = ReadingListActions.confirmedRemoveFromReadingList({
        item: createReadingListItem('B'),
        showSnackBar: true
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B']);
    });

    it('should fail Add To ReadingList', () => {
      const error = 'Failed to add book to the reading list';
      const action = ReadingListActions.failedAddToReadingList({
        error
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B']);
      expect(result.error).toEqual(null);
    });
  })

  it('should failed Remove From ReadingList', () => {
    const error = 'Failed to remove book from the reading list!';
    const action = ReadingListActions.failedRemoveFromReadingList({
      error
    });
    const result: State = reducer(state, action);
    expect(result.ids).toEqual(['A', 'B']);
    expect(result.error).toEqual(null);
  });

});
  describe('unknown action', () => {    
    it('should return the previous state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });

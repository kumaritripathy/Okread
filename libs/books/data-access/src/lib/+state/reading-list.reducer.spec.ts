import { BookConstant } from '@tmo/shared/models';
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
    
    it('should failed Add To ReadingList', () => {
      const error = 'Failed to add book to the reading list';
      const action = ReadingListActions.failedAddToReadingList({
        error
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B']);
      expect(result.error).toEqual(error);
    });
    it('confirmedAddToReadingList should add books to the reading list', () => {
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
    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
       error: BookConstant.ERROR
      });
      const result: State = reducer(state, action);
      expect(result.error).toEqual(BookConstant.ERROR);
    });

    it('should confirmedUpdateToReadingList should mark book as finished in the state', () => {
      const bookFinished = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: new Date().toISOString()
      };
      const action = ReadingListActions.updateReadingList({
        item: bookFinished
      });
      const result: State = reducer(state, action);
      expect(result.entities['A']?.finished).toBeTruthy();
    });

    it('should failedUpdateToReadingList should not mark book as finished in the state', () => {
      const action = ReadingListActions.failedUpdateToReadingList({
        error: BookConstant.ERROR
      });
      const result: State = reducer(state, action);
      expect(result.error).toEqual(BookConstant.ERROR);
    });
  });
  
  })

  describe('unknown action', () => {    
    it('should return the previous state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });

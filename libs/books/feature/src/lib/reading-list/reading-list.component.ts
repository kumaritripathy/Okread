import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList,updateReadingList } from '@tmo/books/data-access';
import { BookConstant} from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {

  readingList$ = this.store.select(getReadingList);
  readonly bookConstant = BookConstant;

  constructor(private readonly store: Store) {}

  removeFromReadingList(readingItem) {
    const item = {
      ...readingItem,
      finished: false,
      finishedDate: '',
    };
    this.store.dispatch(removeFromReadingList({ item }));
  }

  updateReadingList(readingItem) {
    const item = {
      ...readingItem,
      finished: true,
      finishedDate: new Date().toISOString(),
    };
    this.store.dispatch(updateReadingList({ item }));
  }
}

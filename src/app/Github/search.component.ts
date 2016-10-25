
import {Component} from "@angular/core/src/metadata/directives";
import {Output, EventEmitter, ViewChild, ViewContainerRef} from "@angular/core";
import {SearchService, Repository} from "./search.service";
import {Observable} from "rxjs";
import {MdToolbar, MdSidenav} from "@angular/material";
@Component({
    selector: "sidebarContent",
    template: `
        <md-toolbar>Add repo:</md-toolbar>
        <div style="margin: 1em">
            <md-input #value placeholder="Search for GitHub repositories..."
                      #search
                      (change)="onSearch(search.value)"></md-input>
            <md-progress-bar *ngIf="searching" mode="indeterminate"></md-progress-bar>

            <md-list>
                <md-list-item *ngFor="let repo of repositories$ | async">
                    <a target="_blank" style="color: #a0a0a0;" href="https://github.com/{{repo.full_name}}">{{ repo.full_name}}</a>
                    <span class="middle_spacer"></span>
                    <button md-mini-fab (click)="addRepo(repo)">
                        <md-icon class="md-24">add</md-icon>
                    </button>
                </md-list-item>
                <div>
                    <span class="middle_spacer"></span>
                    <button md-button (click)="closeClicked.emit($event)">close</button>
                </div>
            </md-list>
        </div>
`
})
export class SearchComponent{
    @Output() onAdd = new EventEmitter();
    @Output() closeClicked = new EventEmitter();

    searching = false;
    repositories$: Observable<Repository[]>;

    constructor(
        private searchService:SearchService,
        private viewContainerRef: ViewContainerRef
    ) {}

    addRepo(repo: Repository) {
        this.onAdd.emit(repo);
    }

    public onSearch(data) {
        this.searching = true;
        this.repositories$ = this.searchService.search(data);
        this.repositories$.subscribe(() => {},() => {},() => this.searching = false);
    }
}
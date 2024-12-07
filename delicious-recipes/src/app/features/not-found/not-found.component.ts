import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-not-found',
    standalone: true,
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css',
    imports: [RouterLink]
})

export class NotFound { }
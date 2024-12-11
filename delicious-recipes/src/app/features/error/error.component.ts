import { Component, OnInit, signal } from "@angular/core";
import { ErrorService } from "../../core/services/error.service";

@Component({
    selector: 'app-error',
    standalone: true,
    templateUrl: './error.component.html',
    styleUrl: './error.component.css',
})

export class ErrorComponent implements OnInit {
    errorMessage = signal('');
    private timeoutId: any;

    constructor(private errorService: ErrorService) { }

    ngOnInit(): void {
        this.errorService.apiError$.subscribe((error: string | '') => {
            if (error) {
                this.errorMessage.set(error);

                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }

                this.timeoutId = setTimeout(() => {
                    this.errorMessage.set('');
                }, 5000);
            } else {
                this.errorMessage.set('');
            }
        });
    }
}
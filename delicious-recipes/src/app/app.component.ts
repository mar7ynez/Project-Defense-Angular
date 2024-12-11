import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthenticationComponent } from './features/authentication/authentication.component';
import { ErrorComponent } from './features/error/error.component';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent, AuthenticationComponent, ErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getRouteTitle();
        this.titleService.setTitle(currentRoute);
      })

  }

  getRouteTitle(): string {
    const route = this.router.url;

    if (route.endsWith('/details')) {
      return 'Details';
    }

    if (route.endsWith('/edit')) {
      return 'Edit';
    }

    switch (route) {
      case '/': return 'Home';
      case '/catalog': return 'Catalog';
      case '/dashboard': return 'My Recipes';
      case '/create': return 'Create';
      case '/login': return 'Login';
      case '/register': return 'Register';
      case '/profile': return 'Profile';
      case '/404': return '404';

      default: return 'DELICIOUS RECIPES'
    }

  }
}

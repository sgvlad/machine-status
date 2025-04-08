import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MachinesStore} from './state/machines-list.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, RouterLink, MatToolbar, MatButton],
  providers: [MachinesStore],
  standalone: true,
})
export class AppComponent {
}

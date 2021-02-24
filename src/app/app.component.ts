import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ofVersion: string = '';
  queryParam: string = '';

  constructor(private route: ActivatedRoute) {
    if (typeof fin !== 'undefined') {
      this.init();

    } else {
      this.ofVersion = 'The fin API is not available - you are probably running in a browser.';
    }
  }

  async init() {
    //get a reference to the current Application.
    const app = await fin.Application.getCurrent();
    const win = await fin.Window.getCurrent();
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.queryParam = params['test'];
    });
    this.ofVersion = await fin.System.getVersion();

    //Only launch new windows from the main window.
    if (win.identity.name === app.identity.uuid) {
      //subscribing to the run-requested events will allow us to react to secondary launches, clicking on the icon once the Application is running for example.
      //for this app we will  launch a child window the first the user clicks on the desktop.
      app.once('run-requested', async () => {
        await fin.Window.create({
          name: 'childWindow',
          url: location.href,
          defaultWidth: 320,
          defaultHeight: 320,
          autoShow: true
        });
      });
    }
  }
}

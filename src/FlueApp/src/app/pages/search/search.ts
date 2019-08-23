import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FeedService } from '../../providers/services/feed.service';
import { SearchFilterPage } from './search-filter/Search-filter';
import { Person } from '../../shared/models';
import { PeopleService } from '../../providers/services';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  styleUrls: ['./search.scss'],
})
export class SearchPage implements OnInit {
  public people: Person[];


  speakers: any[] = [];
  public posts: any[] = [];
  excludeTracks: any = [];
  queryText;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public router: Router,
    public feedApi: FeedService,
    public modalCtrl: ModalController,
    private peopleService: PeopleService
  ) { }

  updateSearch() {
    this.peopleService.getPeople(this.queryText).subscribe(x => this.people = x);
  }

  ionViewDidEnter() {
    // this.feedApi.getMyFeed().subscribe(x => this.posts = x);
  }

  goToSpeakerTwitter(speaker: any) {
    this.inAppBrowser.create(
      `https://twitter.com/${speaker.twitter}`,
      '_blank'
    );
  }

  ngOnInit(): void {
    this.peopleService.getPeople(this.queryText).subscribe(x => this.people = x);
    // this.feedApi.getMyFeed().subscribe(x => x.posts = x);
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      // this.updateSchedule();
    }
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any)['cordova'] &&
              (window as any)['cordova'].plugins.clipboard
            ) {
              (window as any)['cordova'].plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async openContact(speaker: any) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    await actionSheet.present();
  }


  private getAvatar(post) {
    return post.profilePicture ? post.profilePicture : `/assets/img/profile.png`;
  }


  private follow(person: Person) {
    this.peopleService.follow(person.personId);
    person.isFollowing = true;
  }

  private unfollow(person: Person) {
    this.peopleService.unfollow(person.personId);
    person.isFollowing = false;
  }
}

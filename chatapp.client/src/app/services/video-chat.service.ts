import { AuthService } from './auth.service';
import { inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoChatService {
  private hubUrl = 'https://localhost:5000/hubs/video';

  public hubConnection!: HubConnection;
  public offerReceive = new BehaviorSubject<{
    senderId: string;
    offer: RTCSessionDescriptionInit;
  } | null>(null);
  public answerReceive = new BehaviorSubject<{
    senderId: string;
    answer: RTCSessionDescription;
  } | null>(null);
  public iceCandidateReceive = new BehaviorSubject<{
    senderId: string;
    candidate: RTCIceCandidate;
  } | null>(null);

  private authService = inject(AuthService);

  public incomingCall = false; // To track if there is an incoming call
  public isCallActive = false; // To track if a call is currently active
  public remoteUserId = ''; // To store the ID of the remote user in a call

  public perrConnection!: RTCPeerConnection;

  startConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.authService.getAccessToken!,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch((err) => console.error('Error while starting connection: ', err));

    this.hubConnection.on('ReceiveOffer', (senderId, offer) => {
      console.log('Received offer from:', senderId);
      this.offerReceive.next({ senderId, offer: JSON.parse(offer) });
    });

    this.hubConnection.on('ReceiveAnswer', (senderId, answer) => {
      console.log('Received answer from:', senderId);
      this.answerReceive.next({ senderId, answer: JSON.parse(answer) });
    });

    this.hubConnection.on('ReceiveIceCandidate', (senderId, candidate) => {
      console.log('Received ICE candidate from:', senderId);
      this.iceCandidateReceive.next({
        senderId,
        candidate: JSON.parse(candidate),
      });
    });
  }

  sendOffer(receiverId: string, offer: RTCSessionDescriptionInit) {
    this.hubConnection.invoke('SendOffer', receiverId, JSON.stringify(offer));
  }

  sendAnswer(receiverId: string, answer: RTCSessionDescriptionInit) {
    this.hubConnection.invoke('SendAnswer', receiverId, JSON.stringify(answer))

  }

  sendIceCandidate(receiverId: string, candidate: RTCIceCandidate) {
    this.hubConnection.invoke('SendIceCandidate', receiverId, JSON.stringify(candidate))
  }

  sendEndCall(receiverId: string) {
    this.hubConnection.invoke('EndCall', receiverId);
  }
}

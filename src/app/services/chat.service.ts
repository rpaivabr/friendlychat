import { inject, Injectable } from "@angular/core";
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User, user } from "@angular/fire/auth";
import { addDoc, collection, collectionData, DocumentData, DocumentReference, FieldValue, Firestore, limit, orderBy, query, serverTimestamp } from "@angular/fire/firestore";
import { Router } from "@angular/router";

type ChatMessage = {
  name: string | null,
  profilePicUrl: string | null,
  timestamp: FieldValue,
  uid: string | null,
  text?: string,
  imageUrl?: string
};

@Injectable({ providedIn: 'root' })
export class ChatService {
  private router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private provider = new GoogleAuthProvider();

  // observable that is updated when the auth state changes
  user$ = user(this.auth);
  currentUser: User | null = this.auth.currentUser;

  constructor() {
    this.user$.subscribe((aUser: User | null) => {
      this.currentUser = aUser;
    });
  }

  // Login Friendly Chat.
  login() {
    signInWithPopup(this.auth, this.provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      this.router.navigate(['/', 'chat']);
      return credential;
    });
  }

  // Logout of Friendly Chat.
  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/', 'login'])
      console.log('signed out');
    }).catch((error) => {
      console.log('sign out error: ' + error);
    })
  }

  // Adds a text or image message to Cloud Firestore.
  addMessage = async (
    textMessage: string | null,
    imageUrl: string | null,
  ): Promise<void | DocumentReference<DocumentData>> => {
    // ignore empty messages
    if (!textMessage && !imageUrl) {
      console.log(
        "addMessage was called without a message",
        textMessage,
        imageUrl,
      );
      return;
    }

    if (this.currentUser === null) {
      console.log("addMessage requires a signed-in user");
      return;
    }

    const message: ChatMessage = {
      name: this.currentUser.displayName,
      profilePicUrl: this.currentUser.photoURL,
      timestamp: serverTimestamp(),
      uid: this.currentUser?.uid,
    };

    textMessage && (message.text = textMessage);
    imageUrl && (message.imageUrl = imageUrl);

    try {
      const newMessageRef = await addDoc(
        collection(this.firestore, "messages"),
        message,
      );
      return newMessageRef;
    } catch (error) {
      console.error("Error writing new message to Firebase Database", error);
      return;
    }
  };

  // Saves a new message to Cloud Firestore.
  saveTextMessage = async (messageText: string) => {
    return this.addMessage(messageText, null);
  };

  // Loads chat messages history and listens for upcoming ones.
  loadMessages = () => {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(collection(this.firestore, 'messages'), orderBy('timestamp', 'desc'), limit(12));
    // Start listening to the query.
    return collectionData(recentMessagesQuery);
  }

  // Saves a new message containing an image in Firebase.
  // This first saves the image in Firebase storage.
  saveImageMessage = async (file: any) => { };
}
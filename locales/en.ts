import { WebsiteLocale } from './interface'

const locale: WebsiteLocale = new WebsiteLocale({
    main: {
        genericErrorMessage: 'something went wrong',
        unknown: 'unknown!',
        done: 'done!',
    },
    landing: {
        newPost: 'new post',
        Cid: 'CID',
        findCid: 'here to take a look at a post?',
        wrongCid: 'invalid CID',
    },
    editPost: {
        newPostHeading: 'write something...',
        placeholder: 'once upon a time...',
        override: 'override!',
        publish: 'publish',
        draft: 'save draft',
        draftSaved: 'saved!',
        publishConfirmationMessage:
            'are you sure you want to publish this post?',
        publishedSuccessfully: 'your post is up!',
        publishedOn: 'published on',
    },
    viewPost: {
        invalidCidError: 'are you sure you copied the link right?',
        copyButton: 'CID',
    },
    userInteraction: { confirmation: { cancel: 'cancel', confirm: 'confirm' } },
    web3Provider: {
        changedWillReload:
            'Web3 (wallet) provider has changed. page will reload to apply changes.',
        connect: {
            selectProvider: 'pick your favorite...',
            connected: 'connected',
            disconnected: 'disconnected',
            disconnect: 'disconnect',
            connectButton: {
                notConnected: 'web³ not connected',
            },
        },
    },
})
export default locale

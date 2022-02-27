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
})
export default locale

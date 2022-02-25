import { WebsiteLocale } from './interface'

const locale: WebsiteLocale = new WebsiteLocale({
    main: { genericErrorMessage: 'something went wrong' },
    landing: {
        newPost: 'new post',
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
    },
    viewPost: {
        invalidCidError: 'are you sure you copied the link right?',
    },
    userInteraction: { confirmation: { cancel: 'cancel', confirm: 'confirm' } },
})
export default locale

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
    },
    viewPost: {
        invalidCidError: 'there is no such post available (yet!)',
    },
    userInteraction: { confirmation: { cancel: 'cancel', confirm: 'confirm' } },
})
export default locale

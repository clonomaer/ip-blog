export interface WebsiteLocaleData {
    main: {
        genericErrorMessage: string
        unknown: string
        done: string
    }
    landing: {
        newPost: string
    }
    editPost: {
        newPostHeading: string
        placeholder: string
        override: string
        publish: string
        draft: string
        draftSaved: string
        publishConfirmationMessage: string
        publishedSuccessfully: string
        publishedOn: string
    }
    viewPost: {
        invalidCidError: string
    }
    userInteraction: {
        confirmation: {
            confirm: string
            cancel: string
        }
    }
}
export class WebsiteLocale {
    constructor(public data: WebsiteLocaleData) {}
}

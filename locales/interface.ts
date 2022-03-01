export interface WebsiteLocaleData {
    main: {
        genericErrorMessage: string
        unknown: string
        done: string
    }
    landing: {
        newPost: string
        findCid: string
        wrongCid: string
        Cid: string
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
        copyButton: string
    }
    userInteraction: {
        confirmation: {
            confirm: string
            cancel: string
        }
    }
    web3Provider: {
        changedWillReload: string
        connect: {
            selectProvider: string
            connected: string
            disconnected: string
            disconnect: string
        }
    }
}
export class WebsiteLocale {
    constructor(public data: WebsiteLocaleData) {}
}

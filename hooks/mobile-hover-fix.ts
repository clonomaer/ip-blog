import { useEffect } from 'react'

function replaceStyleSelector(searchValue: string, replaceValue: string) {
    for (
        let sheetIndex = document.styleSheets.length - 1;
        sheetIndex >= 0;
        sheetIndex--
    ) {
        const sheet = document.styleSheets.item(sheetIndex)
        if (!sheet) {
            console.error("Couldn't access stylesheet at index ", sheetIndex)
            continue
        }
        try {
            if (sheet.cssRules) {
                for (
                    let ruleIndex = sheet.cssRules.length - 1;
                    ruleIndex >= 0;
                    ruleIndex--
                ) {
                    const rule = sheet.cssRules.item(ruleIndex)
                    if (!rule) {
                        console.error(
                            "Couldn't access cssRule at index ",
                            ruleIndex,
                            ' of ' + sheet,
                        )
                        continue
                    }
                    //@ts-expect-error real object differs from typings
                    rule.selectorText = rule.selectorText?.replace(
                        searchValue,
                        replaceValue,
                    )
                }
            }
        } catch {
            // console.error("Couldn't access cssRules on ", sheet)
        }
    }
}

function updateStyleSheets(
    mediaQueryList: MediaQueryList | MediaQueryListEvent,
) {
    if (mediaQueryList.matches) {
        replaceStyleSelector(':not(:not(:active))', ':hover')
    } else {
        replaceStyleSelector(':hover', ':not(:not(:active))')
    }
}

export function useMobileHoverFix(): void {
    useEffect(() => {
        window.addEventListener('load', () => {
            const mediaQueryList = window.matchMedia(
                '(hover: hover) and (pointer: fine)',
            )
            updateStyleSheets(mediaQueryList)
            mediaQueryList.addEventListener('change', updateStyleSheets)
        })
    }, [])
}

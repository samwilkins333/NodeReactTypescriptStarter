import * as request from "request-promise";

export namespace Utilities {

    export function url(target: string) {
        return `url(images/${target})`;
    }

    export async function post(relativeRoute: string, body: any) {
        const parameters: request.OptionsWithUri = {
            method: "POST",
            uri: window.location.origin + relativeRoute,
            json: true,
            body
        }
        const response = await request(parameters);
        if (typeof response === "string") {
            try {
                return JSON.parse(response);
            } catch {
                return response;
            }
        }
        return response;
    }

    export async function get(relativeRoute: string) {
        const response = await request(window.location.origin + relativeRoute);
        if (typeof response === "string") {
            return JSON.parse(response);
        }
        return response;
    }

}
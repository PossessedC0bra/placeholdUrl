import type {BrowserStorageApi, BrowserTabApi} from "@/lib/browser/BrowserTabApi.ts";

export const MockBrowserTabApi: BrowserTabApi = {
    init: () => MockBrowserTabApi,
    queryTabs: async () => {
        return [
            {
                id: 123,
                url: "https://{{bucketname}}.s3.{{awsregion}}.amazonaws.com/{{key}}",
                // url: "https://{{subdomain}}.{{domain}}.com/{{path}}/{{file}}.{{extension}}?version={{version}}&user={{userId}}&token={{authToken}}",
                // url: "https://google.{{TLD}}",
                title: "Mock Tab for Development",
                active: true,
                windowId: 1
            }
        ];
    },
    updateTab: async (tabId, {url}) => {
        window.location.href = url;
        return {
            id: tabId,
            url: url,
        }
    }
}

export const MockBrowserStorageApi: BrowserStorageApi = {
    init: () => {
        localStorage.setItem('history', JSON.stringify({
            "https://{{subdomain}}.{{domain}}.com/{{path}}/{{file}}.{{extension}}?version={{version}}&user={{userId}}&token={{authToken}}": [
                {
                    id: 1,
                    name: "Mock History Item 1",
                    placeholders: {
                        '{{subdomain}}': "dev",
                        '{{domain}}': "example",
                        '{{path}}': "path",
                        '{{file}}': "file",
                        '{{extension}}': "txt",
                        '{{version}}': "1.0.0",
                        '{{userId}}': "12345",
                        '{{authToken}}': "mock-token"
                    },
                },
                {
                    id: 2,
                    name: "Mock History Item 2",
                    placeholders: {
                        '{{subdomain}}': "dev",
                        '{{domain}}': "example",
                        '{{path}}': "path/to/resource",
                        '{{file}}': "file",
                        '{{extension}}': "txt",
                        '{{version}}': "1.0.0",
                        '{{userId}}': "12345",
                        '{{authToken}}': "mock-token"
                    },
                }
            ],
            "https://{{bucketname}}.s3.{{awsregion}}.amazonaws.com/{{key}}": [
                {
                    id: 3,
                    name: "[US] files.ykl.ch",
                    placeholders: {
                        '{{bucketname}}': "files.ykl.ch",
                        '{{awsregion}}': "us-west-2",
                        '{{key}}': ""
                    },
                },
                {
                    id: 4,
                    name: "[EU] files.ykl.ch",
                    placeholders: {
                        '{{bucketname}}': "files.ykl.ch",
                        '{{awsregion}}': "eu-central-1",
                        '{{key}}': ""
                    },
                },
                {
                    id: 5,
                    name: "[APAC] files.ykl.ch",
                    placeholders: {
                        '{{bucketname}}': "files.ykl.ch",
                        '{{awsregion}}': "ap-southeast-1",
                        '{{key}}': ""
                    },
                },
            ],
        }));

        return MockBrowserStorageApi
    },
    get: async (keys?: string | string[] | object): Promise<object> => {
        if (typeof keys === 'string') {
            return JSON.parse(localStorage.getItem(keys) || '{}');
        } else if (Array.isArray(keys)) {
            const result: Record<string, any> = {};
            for (const key of keys) {
                result[key] = JSON.parse(localStorage.getItem(key) || '{}');
            }
            return result;
        } else if (typeof keys === 'object') {
            const result = {};
            for (const key in keys) {
                const storedValue = localStorage.getItem(key);
                // @ts-ignore
                result[key] = storedValue == null ? keys[key] : JSON.parse(storedValue);
            }
            return result;
        }
        return Promise.resolve({});
    },
    set: async (items: object): Promise<void> => {
        for (const key in items) {
            // @ts-expect-error TypeScript doesn't know items[key] is serializable
            localStorage.setItem(key, JSON.stringify(items[key]));
        }
    }
}

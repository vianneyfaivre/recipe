import * as jsyaml from "js-yaml";
import type { PageDataDTO } from "../model/yaml";

export async function loadYaml(path: string): Promise<PageDataDTO> {

    const response = await fetch(path);

    if(!response.ok) {
        throw Error(`HTTP ${response.status} - ${response.statusText} - ${path}`);
    }

    const yaml = await response.text();
    let json: any;
    try {
        json = await jsyaml.load(yaml);
    } catch(e) {
        throw Error(`Le fichier "${path}" est invalide : ${e.reason}`);
    }

    // Convert object to Map
    json.recipes = new Map(Object.entries(json.recipes));

    return json;
}
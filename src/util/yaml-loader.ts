import * as jsyaml from "js-yaml";
import type { PageDataDTO } from "../model/recipe";
import { Mappers } from "./model-mapper";

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

    let dto = Mappers.pageData(json);

    return dto;
}
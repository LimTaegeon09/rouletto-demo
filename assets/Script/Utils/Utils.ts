import { Component, js, Label, Node, UITransform } from 'cc';
import { BLACK_NUMBERS, COLOR_COMBINATIONS, Console, RED_NUMBERS } from '../Configs/Config';

export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCurrency(num, digit) {
    const point = digit;

    let num_str = Number(num).toFixed(point).toString();
    return num_str.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + num_str.split('.')[1];
}

export function parseNumber(str: string): number {
    const cleanString = str.replace(/,/g, '');
    const numberValue = parseInt(cleanString, 10);
    return numberValue;
}

export function setFontSize(label, _fontSize, _widthLimit) {
    label.fontSize = _fontSize;
    label.updateRenderData(true);

    while (label.getComponent(UITransform).width > _widthLimit) {
        label.fontSize -= 0.1;
        label.updateRenderData(true);
    }
}

export function setCountryTextScript(node: Node, script: string) {
    node.getComponent(Label).string = script.replace(/\\n/gi, '' + '\n' + '');
}

export function creatEventHandler(target: Node, className: any, handler: string, customEventData?: any) {
    const component = js.getClassName(className);
    const e = new Component.EventHandler();
    e.target = target;
    e.component = component;
    e.handler = handler;
    e.customEventData = String(customEventData);
    return e;
}

export function postMessage(_functionName: string, _params?: Array<any>) {
    let msgConfig = { functionName: _functionName };
    if (_params) msgConfig['params'] = _params;

    window.parent.postMessage(msgConfig, "*");
    Console.css("%cpostMessageToWeb", 'color: #ffffff; background: #9d4ccc; font-weight: bold;', msgConfig);
}

export function pickRandomNumbers(): number[] {
    const results: number[] = [];

    while (results.length < 4) {
        const randomNumber = Math.floor(Math.random() * 37);

        if (!results.includes(randomNumber)) {
            results.push(randomNumber);
        }
    }
    return results;
}

export function sortNumbersAscending(numbers: number[]): number[] {
    return [...numbers].sort((a, b) => a - b);
}

export function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max) + 1;
}

export function getColorCombination(numbers: number[]): string | null {
    const counts = { red: 0, black: 0, green: 0 };
    numbers.forEach(num => {
        if (num === 0) counts.green++;
        else if (RED_NUMBERS.has(num)) counts.red++;
        else if (BLACK_NUMBERS.has(num)) counts.black++;
    });

    if (counts.black === 3 && counts.green === 1) return COLOR_COMBINATIONS[0];
    if (counts.black === 4) return COLOR_COMBINATIONS[1];
    if (counts.black === 3 && counts.red === 1) return COLOR_COMBINATIONS[2];
    if (counts.black === 2 && counts.red === 2) return COLOR_COMBINATIONS[3];
    if (counts.black === 1 && counts.red === 3) return COLOR_COMBINATIONS[4];
    if (counts.red === 4) return COLOR_COMBINATIONS[5];
    if (counts.red === 3 && counts.green === 1) return COLOR_COMBINATIONS[6];

    return null; // 해당하는 조합이 없음
}
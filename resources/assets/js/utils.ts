/**
 * Deep clones an object
 * @param obj The object to cline
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Performs a deep equals on two objects
 * @param first The first object
 * @param second The second object
 */
export function deepEquals(first: any, second: any): boolean {
    return JSON.stringify(first) == JSON.stringify(second);
}

/**
 * Traverses an object and grabs the value at the given path
 * @param path The path in the object
 * @param obj The object to traverse
 */
export function traverseObject(path, obj): any {
    let splitPath = path.split('.');
    let toReturn = obj;
    splitPath.forEach(p => {
        toReturn = toReturn[p];
    });
    return toReturn;
}

/**
 * Generates an ID
 * @param length The length of the ID
 */
export function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
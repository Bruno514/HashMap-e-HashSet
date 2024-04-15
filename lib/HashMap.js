import LinkedList from "./LinkedList.js";
import Node from "./Node.js";

export default class HashMap {
  #buckets = Array(16)
    .fill()
    .map((_, i) => new LinkedList());
  #capacity = this.#buckets.length;
  #loadFactor = 0.75;

  #checkBucketIndex(index) {
    if (index < 0 || index >= this.#buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
  }

  #checkThreshold() {
    let occupied = 0;
    this.#buckets.forEach((element) => {
      if (element.head !== null) occupied++;
    });

    if (occupied > this.#capacity * this.#loadFactor) {
      const fillingBuckets = Array(this.#capacity)
        .fill()
        .map((_, i) => new LinkedList());

      const newBuckets = [...this.#buckets].concat(fillingBuckets);

      this.#buckets = [...newBuckets];
      this.#capacity *= 2;
    }
  }

  _hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.#capacity;
    }

    return hashCode;
  }

  set(key, value) {
    if (typeof key !== "string") {
      throw new Error("Key can only be string.");
    }

    const hashcode = this._hash(key);
    this.#checkBucketIndex(hashcode);

    const linkedList = this.#buckets[hashcode];
    const keyValuePair = linkedList.filter((value) => value[0] === key);

    if (Array.isArray(keyValuePair)) {
      keyValuePair[1] = value;
    } else {
      this.#buckets[hashcode].append(new Node([key, value]));
    }

    this.#checkThreshold();
  }

  get(key) {
    if (typeof key !== "string") {
      throw new Error("Key can only be string.");
    }

    const hashcode = this._hash(key);
    this.#checkBucketIndex(hashcode);

    const linkedList = this.#buckets[hashcode];
    const keyValuePair = linkedList.filter((value) => value[0] === key);

    return Array.isArray(keyValuePair) && keyValuePair.length
      ? keyValuePair[0][1]
      : null;
  }

  has(key) {
    const hashcode = this._hash(key);
    this.#checkBucketIndex(hashcode);

    const linkedList = this.#buckets[hashcode];

    return linkedList.some((value) => value[0] === key);
  }

  remove(key) {
    if (typeof key !== "string") {
      throw new Error("Key can only be string.");
    }

    const hashcode = this._hash(key);
    this.#checkBucketIndex(hashcode);

    const linkedList = this.#buckets[hashcode];

    let currentNode = linkedList.headNode();
    let index = 0;
    while (currentNode !== null) {
      if (currentNode.value[0] === key) {
        linkedList.removeAt(index);
        return true;
      }
      currentNode = currentNode.nextNode;
      index += 1;
    }

    return false;
  }

  length() {
    let length = 0;
    for (let i = 0; i < this.#buckets.length; i++) {
      length += this.#buckets[i].size();
    }

    return length;
  }

  clear() {
    this.#buckets = Array(this.#capacity)
      .fill()
      .map((_, i) => new LinkedList());
  }

  entries() {
    let allKeys = [];
    for (let i = 0; i < this.#buckets.length; i++) {
      const list = this.#buckets[i];

      let keys = list.filter((value) => {
        return Array.isArray(value);
      });

      if (Array.isArray(keys)) {
        allKeys = allKeys.concat(keys);
      }
    }

    return allKeys.length ? [...allKeys] : null;
  }

  keys() {
    let allEntries = this.entries();
    let keys;

    if (Array.isArray(allEntries)) {
      keys = allEntries.map((e) => {
        return e[0];
      });
    }

    return allEntries !== null ? [...keys] : null;
  }

  values() {
    let allEntries = this.entries();
    let values;

    if (Array.isArray(allEntries)) {
      values = allEntries.map((e) => {
        return e[1];
      });
    }

    return allEntries !== null ? [...values] : null;
  }

  get buckets() {
    return this.#buckets;
  }
}

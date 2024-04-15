import LinkedList from "./LinkedList.js";
import Node from "./Node.js";

export default class HashSet {
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

  add(key) {
    if (typeof key !== "string") {
      throw new Error("Key can only be string.");
    }

    const hashcode = this._hash(key);
    this.#checkBucketIndex(hashcode);

    const list = this.#buckets[hashcode];
    const node = list.at(list.find(key));

    if (node !== null) {
      node.value = key;
    } else {
      list.append(new Node(key));
    }

    this.#checkThreshold();
  }

  has(key) {
    const hashcode = this._hash(key);
    this.#checkBucketIndex(hashcode);

    const linkedList = this.#buckets[hashcode];

    return linkedList.some((value) => value === key);
  }

  remove(key) {
    if (typeof key !== "string") {
      throw new Error("Key can only be string.");
    }

    const hashcode = this._hash(key);
    this.#checkBucketIndex(hashcode);

    const list = this.#buckets[hashcode];
    const keyIndex = list.find(key);
    if (keyIndex === null) {
      return false;
    }

    list.removeAt(keyIndex);

    return true;
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

  keys() {
    let allKeys = [];
    for (let i = 0; i < this.#buckets.length; i++) {
      const list = this.#buckets[i];

      let keys = list.map((value) => {
        return value;
      });

      if (Array.isArray(keys)) {
        allKeys = allKeys.concat(keys);
      }
    }

    return allKeys.length ? [...allKeys] : null;
  }

  get buckets() {
    return this.#buckets;
  }
}

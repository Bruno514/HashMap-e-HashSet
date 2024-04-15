import Node from "./Node.js";

export default class LinkedList {
  #size = 0;

  constructor(node = null) {
    if (node !== null && !(node instanceof Node)) {
      throw new Error("Node parameter is not a node.");
    }

    if (node !== null) this.#size++;
    this.head = node;
  }

  #isNodeInstance(object) {
    if (!(object instanceof Node)) {
      throw new Error("Node parameter is not a node.");
    }

    return true;
  }

  append(node) {
    this.#isNodeInstance(node);

    if (this.head === null) {
      this.head = node;
    } else {
      let currentNode = this.head;

      while (currentNode.nextNode != null) {
        currentNode = currentNode.nextNode;
      }

      currentNode.nextNode = node;
    }

    this.#size++;
  }

  prepend(node) {
    this.#isNodeInstance(node);

    if (this.head === null) this.head = node;
    else {
      node.nextNode = this.head;
      this.head = node;
    }

    this.#size++;
  }

  size() {
    return this.#size;
  }

  headNode() {
    return this.head;
  }

  tailNode() {
    if (this.#size === 0) return null;

    return this.at(this.#size - 1);
  }

  at(index) {
    let currentNode = this.head;

    if (index < 0) throw new Error("Index negative.");

    for (let i = 0; i < index; i++) {
      currentNode = currentNode.nextNode;
      if (currentNode === null) break;
    }

    return currentNode;
  }

  pop() {
    if (this.head === null) throw new Error("Cannot delete.");

    if (this.#size === 1) this.head = null;
    else {
      let pointer = this.at(this.#size - 2);
      pointer.nextNode = null;
    }

    this.#size--;
  }

  contains(value) {
    return this.find(value) === null ? null : true;
  }

  find(value) {
    let currentNode = this.head;
    let index = 0;

    while (currentNode != null && currentNode.value != value) {
      currentNode = currentNode.nextNode;
      index += 1;
    }

    return currentNode === null ? null : index;
  }

  insertAt(value, index) {
    if (this.head === null) throw new Error("List is empty.");

    const newNode = new Node(value);

    if (index === 0) this.prepend(newNode);
    else {
      let prevNode = this.at(index - 1);
      if (prevNode.nextNode === null) throw new Error("Index is null.");

      newNode.nextNode = prevNode.nextNode;
      prevNode.nextNode = newNode;
    }

    this.#size++;
  }

  removeAt(index) {
    if (this.head === null) throw new Error("List is empty.");

    if (index === 0) {
      this.head = this.head.nextNode;
    } else {
      const prev = this.at(index - 1);
      const curr = prev.nextNode;
      if (curr === null) throw new Error("Index is null");
      const next = curr.nextNode;

      prev.nextNode = next;
    }

    this.#size--;
  }

  some(callback) {
    if (this.head === null) return false;
    else {
      let currentNode = this.head;
      if (callback(currentNode.value)) return true;

      while (currentNode.nextNode != null) {
        currentNode = currentNode.nextNode;
        if (callback(currentNode.value)) return true;
      }

      return false;
    }
  }

  filter(callback) {
    const filtered = [];

    if (this.head === null) return null;
    else {
      let currentNode = this.head;
      let filteredItem = callback(currentNode.value) ? currentNode.value : null;

      if (filteredItem && Array.isArray(filteredItem)) {
        filtered.push([...filteredItem]);
      } else if (filteredItem && !Array.isArray(filteredItem)) {
        filtered.push(filteredItem);
      }

      while (currentNode.nextNode != null) {
        currentNode = currentNode.nextNode;
        let filteredItem = callback(currentNode.value)
          ? currentNode.value
          : null;

        if (filteredItem && Array.isArray(filteredItem)) {
          filtered.push([...filteredItem]);
        } else if (filteredItem && !Array.isArray(filteredItem)) {
          filtered.push(filteredItem);
        }
      }

      return Array.isArray(filtered) && filtered.length ? [...filtered] : null;
    }
  }

  map(callback) {
    const mapped = [];

    if (this.head === null) return null;
    else {
      let currentNode = this.head;
      mapped.push(callback(currentNode.value));

      while (currentNode.nextNode != null) {
        currentNode = currentNode.nextNode;
        mapped.push(callback(currentNode.value));
      }

      return Array.isArray(mapped) && mapped.length ? [...mapped] : null;
    }
  }

  toString() {
    if (this.head === null) return "null";

    let currentNode = this.head;
    let string = `( ${currentNode.value} ) -> `;

    while (currentNode.nextNode != null) {
      currentNode = currentNode.nextNode;
      string += `( ${currentNode.value} ) -> `;
    }
    string += "null";

    return string;
  }
}

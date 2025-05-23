// backend/models/movement.model.js
class Movement {
  constructor({ id, description, amount, type, category, date }) {
    this.id = id;
    this.description = description;
    this.amount = amount;
    this.type = type;
    this.category = category;
    this.date = date;
  }
}

module.exports = Movement;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var eventSchema = new Schema({
    name: { type: String, required: [true, 'Event name is required.'] },
    description: { type: String, required: [true, 'Description is required.'] },
    status: { type: Boolean, required: true, default: true },
    place: { type: String, required: [true, 'Place is required.'] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Event', eventSchema);
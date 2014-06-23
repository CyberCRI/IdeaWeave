var reduce;
// remove the tags db first
db.tags.remove();
mapptags = function() {
    emit(this._id, this.value);
};
mapctags = function() {
    emit(this._id, this.value);
};
maptutags = function() {
    emit(this._id, this.value);
};
reduce = function(key,value) {
	return Array.sum(value);
};
//db.ctags.mapReduce(mapctags, reduce, {"out": {"reduce": "tags"}});
db.ptags.mapReduce(mapptags, reduce, {"out": {"reduce": "tags"}});
db.utags.mapReduce(maptutags, reduce, {"out": {"reduce": "tags"}});

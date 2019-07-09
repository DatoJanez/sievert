const db = new Dexie('sieverts-db');

	// Declare tables, IDs and indexes
db.version(1).stores({
    sieverts: '++id, keyword, value'
});

// log ("Using Dexie v" + Dexie.semVer);

//
// Query Database
//
// db.open().then(db.sieverts.add({name: "news", age: 42}))

var load = (keyword) => {
    db.open()
    .then(db.sieverts.where("keyword").equals(keyword)
        .first(saved_sievert => {
            document.getElementById("chart").innerHTML = ""
            preccess_ress(saved_sievert.value)
        }))
}

var initSavedSiverets = () => {
    document.getElementById("saved").innerHTML = ''
    db.open()
        .then(db.sieverts
            .each(saved_sievert => {
                var saved_dom = document.createElement('div')
                saved_dom.innerHTML = saved_sievert.keyword
                saved_dom.addEventListener("click", e => load(e.target.innerHTML))
                document.getElementById("saved").appendChild(saved_dom)
            }))
}

initSavedSiverets()


// db.open().then(function(){
// 	return db.sieverts.add({keyword: "news", value: sample_ress});
// })

// then(function(){
// 	return db.friends
// 		.where('age')
// 		.between(40,65)
// 		.toArray();
// }).then(function(friends){
// 	log("Found friends: " + JSON.stringify(friends, null, 2));
// })
// .then(function(){
// 	return db.delete(); // So you can experiment again and again...
// })
// .catch (Dexie.MissingAPIError, function (e) {
// 	log ("Couldn't find indexedDB API");
// }).catch ('SecurityError', function(e) {
//   log ("SeurityError - This browser doesn't like fiddling with indexedDB.");
//   log ("If using Safari, this is because jsfiddle runs its samples within an iframe");
//   log ("Go run some samples instead at: https://github.com/dfahlander/Dexie.js/wiki/Samples");
// }).catch (function (e) {
// 	log (e);
// });




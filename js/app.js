function Student(firstName, lastName, dateOfBirth, email, portrait) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.dateOfBirth = dateOfBirth;
	this.email = email;
	this.portrait = portrait;
}

/** Compare two students.
 * 
 * The method compares case sensitive the last name, first name, date of birth 
 * in this order. 
 */
Student.compare = function(a, b) {
	var result = a.lastName - b.lastName;
	if (result == 0) {
		result = a.firstname - b.firstName;
	}
	if (result == 0) {
		result = a.dateOfBirths - b.dateOfBirth;
	}
	return result;	
};

Student.prototype = {
	/** Compare with another Student.
	 * 
	 * The method uses the class method to compare the students. 
	 */
	compare: function(other) {
		return Student.compare(this, other);
	},
	
	
	init: function(firstName, lastName, dateOfBirth, email, portrait) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.dateOfBirth = dateOfBirth;
		this.email = email;
		this.portrait = portrait;
	}
};

function Course(name) {
	this.name = name;
	this.students = [];
}

Course.prototype = {
	addStudent: function(student) {
		if (this.students.indexOf(student) < 0) {
			this.students.push(student);
		}
	},

	deleteStudent: function(student) {
		var i = this.students.indexOf(student);
		if (i >= 0) {
			// student exists -> remove
			this.students.splice(i, 1);
		} 	
	},
	
	sortStudents: function() {
		this.students.sort(Student.compare);
	},
	
	print: function() {
		console.log("Print");
	},
	
	exportCourse: function() {
		console.log("json: " + this + " " + JSON.stringify(this));
		var blob = new Blob([JSON.stringify(this)], {type: "text/json"});
		saveAs(blob, course.name + ".json");
	}
};

var course = new Course(document.getElementById("coursename").value);


// 
function StudentsListView(list, model) {
	this.list = list;
	this.model = model;
};

StudentsListView.prototype = {
	update: function() {
		// Empty list
		this.list.innerHTML = "";
		
		for (var i = 0; i < this.model.length; i++) {
			this.appendStudent(i + 1, this.model[i]);
		}
	},
	
	appendStudent: function(index, student) {
		var studentItem = document.createElement("li");
		
		var innerList = document.createElement("ul");
		innerList.classList.add("list-unstyled");
		studentItem.appendChild(innerList);
		
		var image = document.createElement("img");
		image.setAttribute("src", student["portrait"]);
		image.classList.add("listphoto");
		var listItem = document.createElement("li");
		listItem.appendChild(image);
		innerList.appendChild(listItem);
				
		// Add neccessary attribute values form the student object to the table row
		var attributes = ["firstName", "lastName", "dateOfBirth", "email"];
		attributes.forEach(function(element) {
			listItem = document.createElement("li");
			listItem.innerHTML = student[element];
			innerList.appendChild(listItem);
		});
	
		// Add edit and delete button
		var button = document.createElement("button");
		button.setAttribute("type", "button",
			"class", "btn");
		button.addEventListener("click", function(event) {
				editStudent(event, student);
			});
		button.innerHTML = '<i class="glyphicon glyphicon-edit"></i>';		
		listItem = document.createElement("li");
		listItem.appendChild(button);
		button = document.createElement("button");
		button.setAttribute("type", "button",
			"class", "btn");
		button.addEventListener("click", function(event) {
				deleteStudent(event, student);
			});
		button.innerHTML = '<i class="glyphicon glyphicon-trash"></i>';		
		listItem.appendChild(button);
		innerList.appendChild(listItem);
	
		this.list.appendChild(studentItem);
	}

};

function StudentsTableView(table, model) {
	this.table = table;
	this.model = model;
};
StudentsTableView.columnHeaders = ["Nr.", "Photo", "Vorname", "Nachname", 
	"Geburtsdatum", "Email-Adresse", "Aktion"];

StudentsTableView.prototype = {
	update: function() {
		// Empty table head
		this.table.getElementsByTagName("thead")[0].innerHTML = "";
		// Empty table body
		this.table.getElementsByTagName("tbody")[0].innerHTML = "";
		
		this.addHeader();
		for (var i = 0; i < this.model.length; i++) {
			this.appendStudent(i + 1, this.model[i]);
		}
	},
	
	addHeader: function() {
		var tableRow = document.createElement("tr");
		StudentsTableView.columnHeaders.forEach(function(item) {
			var columnHeader = document.createElement("th");
			columnHeader.innerHTML = item;
			tableRow.appendChild(columnHeader);		
		});

		var tableHead = this.table.getElementsByTagName("thead")[0];
		tableHead.appendChild(tableRow);
	},
	
	appendStudent: function(index, student) {
		var tableRow = document.createElement("tr");
		
		// Add index number as first element to table row
		var cell = document.createElement("td");
		cell.innerHTML = index;
		tableRow.appendChild(cell);

		// Scale the image for the table view and insert it into the table row
		var image = document.createElement("img");
		image.setAttribute("src", student["portrait"]);
		//image.style.width = "10%";
		//image.style.height = "auto";
		image.classList.add("tablephoto");
		cell = document.createElement("td");
		//cell.style.width = "10%";
		//cell.style.height = "auto";
		cell.appendChild(image);
		tableRow.appendChild(cell);
				
		// Add neccessary attribute values form the student object to the table row
		var attributes = ["firstName", "lastName", "dateOfBirth", "email"];
		attributes.forEach(function(element) {
			cell = document.createElement("td");
			cell.innerHTML = student[element];
			tableRow.appendChild(cell);
		});
	
		// Add edit and delete button
		var button = document.createElement("button");
		button.setAttribute("type", "button",
			"class", "btn");
		button.addEventListener("click", function(event) {
				editStudent(event, student);
			});
		button.innerHTML = '<i class="glyphicon glyphicon-edit"></i>';		
		cell = document.createElement("td");
		cell.appendChild(button);
		button = document.createElement("button");
		button.setAttribute("type", "button",
			"class", "btn");
		button.addEventListener("click", function(event) {
				deleteStudent(event, student);
			});
		button.innerHTML = '<i class="glyphicon glyphicon-trash"></i>';		
		cell.appendChild(button);
		tableRow.appendChild(cell);
	
		// Add newly created table row to Table body
		var tableBody = this.table.getElementsByTagName("tbody")[0];
		tableBody.appendChild(tableRow);
	}

};

var studentsListView = new StudentsListView(document.getElementById("studentsListView"),
	course.students);
studentsListView.update();

var studentsTableView = new StudentsTableView(document.getElementById("studentsTableView"),
	course.students);
studentsTableView.update();

Webcam.set({
	// live preview size
	width: 4/3*400,
	height: 400,
			
	// device capture size
	//dest_width: 320,
	//dest_height: 240,
			
	// final cropped size
	crop_width: 400,
	crop_height: 400,
			
	// format and quality
	image_format: 'jpeg',
	jpeg_quality: 90
});

Webcam.attach("#camera");



var visibleContainer = "students_container";
function showContainer(id) {
	var container = document.getElementById(id);
	if (container) {
		document.getElementById(visibleContainer).hidden = true;
		container.hidden = false;
		visibleContainer = id;
	}
}

// Bind event handlers 

document.getElementById("print").addEventListener("click", function(event) {
	course.print();
});
document.getElementById("export").addEventListener("click", function(event) {
	course.exportCourse();
});
document.getElementById("coursename").addEventListener("change", function(event) {
	course.name = document.getElementById("coursename").value;
});
document.getElementById("createstudent").addEventListener("click", createStudent);
document.getElementById("editok").addEventListener("click", saveStudent);
document.getElementById("editcancel").addEventListener("click", function(event) {
	showContainer('students_container');
});
document.getElementById("photobooth").addEventListener("click", showPhotobooth);
document.getElementById("takephoto").addEventListener("click", takeSnapshot);
document.getElementById("photocancel").addEventListener("click", cancelPhoto);
document.getElementById("photook").addEventListener("click", savePhoto);

var student;

function createStudent(event) {
	// Reset all inputs
	document.getElementById("firstname").value = null;
	document.getElementById("lastname").value = null;
	document.getElementById("dateofbirth").value = null;
	document.getElementById("email").value = null;
	document.getElementById("portrait")["src"] = "assets/portrait-400x400.png";

	student = new Student(null, null, null, null, null);
		
	showContainer("editstudent_container");
}

function editStudent(event, current) {
	// Set all inputs
	console.log(current["firstname"]);
	document.getElementById("firstname").value = current["firstName"];
	document.getElementById("lastname").value = current["lastName"];
	document.getElementById("dateofbirth").value = current["dateOfBirth"];
	document.getElementById("email").value = current["email"];
	document.getElementById("portrait")["src"] = current["portrait"];
	
	student = current;

	showContainer("editstudent_container");	
}

function deleteStudent(event, student) {
	course.deleteStudent(student);
	studentsTableView.update();
}

function saveStudent(event) {
	// Save student data
	student.init(
		document.getElementById("firstname").value,
		document.getElementById("lastname").value,
		document.getElementById("dateofbirth").value,
		document.getElementById("email").value,
		document.getElementById("portrait")["src"]
	);
	course.addStudent(student);
	course.sortStudents();
	studentsTableView.update();
	studentsListView.update();
	
	showContainer("students_container");
}

function showPhotobooth(event) {
	// Reset image
	document.getElementById("preview")["src"] = "assets/portrait-400x400.png";
	
	showContainer("photobooth_container");
}

function takeSnapshot() {
	// take snapshot and get image data
	Webcam.snap( function(data_uri) {
		// display results in page
		document.getElementById("preview")["src"] = data_uri;
	} );
}

function savePhoto(event) {
	// Copy image data form preview to student field 
	document.getElementById("portrait")["src"] = document.getElementById("preview")["src"];
	
	showContainer("editstudent_container");
}

function cancelPhoto(event) {
	showContainer("editstudent_container");	
}
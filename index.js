require("dotenv").config();

const express= require("express");
const ejs=require("ejs");
const app= express();
const mongoose = require("mongoose");
const methodOverride= require("method-override");
const path= require("path");
const HOD_login= require("./module/HOD_login.js");
const student= require("./module/student.js")
const subject= require("./module/subjects.js");
const attendence= require("./module/attendence.js");
const teachers = require("./module/teachers.js");
const { title } = require("process");

//const imageURL= img.src;
//const imgHTML = "+'<img src='"+imageURL+'"style="max-width:100%;max-hight:100%"/>'
//const staff  = require("./module/staff.js");

//response.render('./index',{title:'Express.js',view:imgHTML});
app.set("view engine","ejs");
app.set("views",  path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '/Photos')));
const dbURL = process.env.ATLAS_URL;
async function main(){
  await mongoose.connect(dbURL,{
    /* useNewUrlParser: true,
    useUnifiedTopology: true*/
  }).then(()=>{
    console.log("mongo is working");
  }).catch(err =>{
    console.error("error is"+err);
  });
}
main().then( ()=>{
  console.log(" mongo is working");
})
.catch((err) => console.log(err));
const port= process.env.PORT;


app.listen(port,()=> {
  console.log("listening on port "+port);
});


app.get("/",async (res,req)=>{
  req.render("home.ejs");
});

//to show the information about the student
app.post("/fullinfo", async(req,res)=>{
  let {roll,branch}=req.body;
  let attendences= await attendence.find();
  let subjects= await subject.find();
  let students= await student.find();
  for(let student of students){
    if(student.roll==roll && student.branch==branch){
      res.render("personalinfo.ejs",{student,subjects,attendences});
    }
  }
});

//to show about us
app.get("/about",(res,req)=>{
  req.render("about.ejs");
});


//hod
//hod login due to these only hod can do there work
app.get("/HOD_login",async (req,res)=>{
  let id="67160509bc22aabac46639de";
  let hod_login= await HOD_login.findById(id, {timeoutMS:3000});
  if(hod_login==null){
    res.render("set_hod_pass");
  }
  else{
    res.render("HOD_login.ejs");
  }
});

app.get("/forgot_password",async (req,res)=>{
  res.render("forgot_password.ejs");
});

app.post("/forgot_password",async (req,res)=>{
  let {name, uname, password, cpassword}= req.body;
  let id="67160509bc22aabac46639de";
  let hod_login= await HOD_login.findById(id, {timeoutMS:3000});
  if(hod_login.name==name && hod_login.Username==uname && password==cpassword){
    let edit_L_number=await HOD_login.findByIdAndUpdate(id,
      {Password: password}
    );
    res.render("HOD_login.ejs");
  }
});

app.post("/set_Hod_pass",async (req,res)=>{
  let {uname, password, check_password}=req.body;
  if(password==check_password){
    let chat1 = new HOD_login(
      {
        Username: uname,
        Password: password
      }
    );
    chat1.save().then(res => {
    }).catch(err =>{
    console.log(err);
    });
    res.redirect("/HOD_login");
  }
  else{
    req.redirect("/HOD_login");
  }
});

//Check the password and throw on the hod page
app.post("/Check_Hod_login",async (req,res)=>{
  let {uname, password}=req.body;
  let id="67160509bc22aabac46639de";
  let hod_login= await HOD_login.findById(id);
  if(uname==hod_login.Username||password==hod_login.Password){
    res.redirect("/HOD");
  }
  else{
    res.redirect("/");
  }
});


app.post("/hod_login", async (req,res)=>{
  let {Username, Password}=req.body;
  let done= await HOD_login.find();
  let newnote = new HOD_login({
    Username: Username,
    Password: Password
  });
  console.log(done);
 await newnote.save()
  .then(res =>{console.log("note is created")})
  .catch(err=>{console.log(err)});
});

//hod can do there work or see information
app.get("/HOD",async (res,req)=>{
  students=await student.find();
  teacher=await teachers.find();
  subjects=await subject.find();
  attendances=await attendence.find();
  req.render("hod.ejs",{students,teacher,subjects,attendances});
});

//to add new student
app.get("/Addmission",async (res,req)=>{
  req.render("addmission.ejs");
});

app.post("/addmission", async (req,res)=>{
  let {name,mname, lname, branch, prn}=req.body;
  let checks= await student.find();
  var roll_bcsfy= 0;
  var roll_bcssy= 0;
  var roll_bcsty= 0;
  var roll_bcafy= 0;
  var roll_bcasy= 0;
  var roll_bcaty= 0;

  for(let check of checks){
    if(check.branch=="bcsfy"){
      roll_bcsfy=roll_bcsfy+1;
    }
    else if(check.branch=="bcssy"){
      roll_bcssy=roll_bcssy+1;
    }
    else if(check.branch=="bcsty"){
      roll_bcsty=roll_bcsty+1;
    }
    if(check.branch=="bcsafy"){
      roll_bcafy=roll_bcafy+1;
    }
    else if(check.branch=="bcasy"){
      roll_bcasy=roll_bcasy+1;
    }
    else if(check.branch=="bcaty"){
      roll_bcaty=roll_bcaty+1;
    }
  }
  roll_bcsfy=roll_bcsfy+1;
  roll_bcssy=roll_bcssy+1;
  roll_bcsty=roll_bcsty+1;
  roll_bcafy=roll_bcafy+1;
  roll_bcasy=roll_bcasy+1;
  roll_bcaty=roll_bcaty+1;
  if(branch=="bcsfy"){
    let new_student = new student({
      name: name,
      fathers_name: mname,
      surname: lname,
      branch: branch,
      PRN: prn,
      roll: roll_bcsfy,
      number_of_days_present: 0
    });
    await new_student.save()
  .then(res =>{console.log(new_student)})
  .catch(err=>{console.log(err)});
  }
  else if(branch=="bcssy"){
    let new_student = new student({
      name: name,
      fathers_name: mname,
      surname: lname,
      branch: branch,
      PRN: prn,
      roll: roll_bcssy,
      number_of_days_present: 0
    });
    await new_student.save()
  .then(res =>{console.log(new_student)})
  .catch(err=>{console.log(err)});
  }
  else if(branch=="bcsty"){
    let new_student = new student({
      name: name,
      fathers_name: mname,
      surname: lname,
      branch: branch,
      PRN: prn,
      roll: roll_bcsty,
      number_of_days_present: 0
    });
    await new_student.save()
  .then(res =>{console.log(new_student)})
  .catch(err=>{console.log(err)});
  }
  if(branch=="bcafy"){
    let new_student = new student({
      name: name,
      fathers_name: mname,
      surname: lname,
      branch: branch,
      PRN: prn,
      roll: roll_bcafy,
      number_of_days_present: 0
    });
    await new_student.save()
  .then(res =>{console.log(new_student)})
  .catch(err=>{console.log(err)});
  }
  else if(branch=="bcasy"){
    let new_student = new student({
      name: name,
      fathers_name: mname,
      surname: lname,
      branch: branch,
      PRN: prn,
      roll: roll_bcasy,
      number_of_days_present: 0
    });
    await new_student.save()
  .then(res =>{console.log(new_student)})
  .catch(err=>{console.log(err)});
  }
  else if(branch=="bcaty"){
    let new_student = new student({
      name: name,
      fathers_name: mname,
      surname: lname,
      branch: branch,
      PRN: prn,
      roll: roll_bcaty,
      number_of_days_present: 0
    });
    await new_student.save()
  .then(res =>{console.log(new_student)})
  .catch(err=>{console.log(err)});
  }
  res.redirect("/"); 
});

// to search the student information
app.post("/student",async (req,res)=>{
  let Roll=0;
  let branch;
  students= await student.find();
  subjects=await subject.find();
  res.render("bcsfy.ejs",{Roll,branch,students,subjects});
 });

app.post("/showinfo",async (req,res)=>{
  let {Roll,branch} =req.body;
  students= await student.find();
  subjects= await subject.find();
  attendances= await attendence.find()
  res.render("bcsfy.ejs",{Roll,branch,students,subjects,attendances});
 });

 //Teachers
//to login form of teachers 
app.get("/teacherlogin",async (req,res)=>{
  let teacherss=await teachers.find();
  res.render("teacherlogin.ejs");
 });

 //to check the password enter by the teacher
app.post("/check_pass", async(req, res)=>{
  let {uname,password}=req.body;
  teacherss=await teachers.find();
  for(let teachers of teacherss){
    var check= teachers.user_name;
    if(check==uname && teachers.password==password)
    {  
      id= teachers.id;
      res.redirect("/individual_teacher/"+id);
    }
  }
});

//to show the information about the teachers and subject
app.get("/individual_teacher/:id", async(req, res)=>{
  let { id }= req.params;
  attendances= await attendence.find();
  teacherss=await teachers.findById(id);
  subjects=await subject.find();
  res.render("individual_teacher.ejs",{teacherss,subjects,attendances});
});

app.get("/forgot_password_teacher",async (req,res)=>{
  res.render("forgot_password_teacher.ejs");
});

app.post("/forgot_password_teacher",async (req,res)=>{
  let {name, uname, password, cpassword}= req.body;
  teacherss= await teachers.find();
  for(let teacher of teacherss){

    if(teacher.name==name && teacher.user_name==uname && password==cpassword){
      let edit_pass=await teachers.findByIdAndUpdate(teacher.id,
        {password: password}
      );
      res.render("teacherlogin.ejs");
    }
  }
});

//add new teachers
app.get("/new_teacher", async (req,res)=>{
  res.render("new_teacher.ejs");
});


app.post("/new_teacher", async (req,res)=>{
  let {name, username, password}=req.body;
  let new_teachers = new teachers({
    name: name,
    user_name: username,
    password: password
  });
 await new_teachers.save()
  .then(res =>{console.log("Added")})
  .catch(err=>{console.log(err)});
  res.redirect("/teacherlogin");
});

//to add, show and remove and edit the subject
app.get("/subject", async (req,res)=>{
  let teacherss= await teachers.find();
  let subjects= await subject.find();
  res.render("subject.ejs",{subjects,teacherss});
});
//to add new subject
app.get("/new_subject",async (req,res)=>{
  res.render("new_subject.ejs");
});
app.post("/new_subject",async (req,res)=>{
  let { name,branch,sem}=req.body;
  console.log(name+branch+sem);
  let newsub = new subject({
    name: name,
    branch: branch,
    sem: sem,
    remaing_l: 45,
    taken_l: 0,
    total_l: 45
  });
  res.redirect("/subject");
 await newsub.save()
  .then(res =>{console.log("new subject added")})
  .catch(err=>{console.log(err)});
  });
  //to add the teacher to the subject
  app.post("/add_teacher/:id",async (req,res)=>{
    let { id }= req.params;
    let {teacher}= req.body;
    let edit_name=await subject.findByIdAndUpdate(id,
      {teacher_name: teacher}
    );
    res.redirect("/subject");
  });
  //to remove the subject
  app.post("/remove_subject/:id",async (req,res)=>{
    let { id }=req.params;
    let remove_subject=await subject.findByIdAndDelete(id);
    res.redirect("/subject");
  });
  

  //Attendance
  app.get("/show_subject/:teacher_name",async (req,res)=>{
    let { teacher_name }= req.params;
    let subjects=await subject.find();
    let branch="bcsfy";
    res.render("show_subject.ejs",{teacher_name,subjects,branch});
  });
  app.post("/show_subject/:teacher_name",async (req,res)=>{
    let { teacher_name }= req.params;
    let { branc }= req.body;
    let branch=branc;
    let subjects=await subject.find();
    res.render("show_subject.ejs",{teacher_name,subjects,branch});
  });
  app.get("/attendence/:teacher_name/:branch/:sem/:name",async (req,res)=>{
    let { teacher_name,branch,sem,name }= req.params;
    let students= await student.find();
    let subjects= await subject.find();
    let attendances= await attendence.find();
    console.log(attendances)
    res.render("attendence.ejs",{ students,subjects,branch,teacher_name,sem,name,attendances });
   });
   //to add attendence
   app.post("/present/:branch/:subject_name/:l_number/:roll/:teacher_name", async(req, res)=>{
    let { branch,subject_name,l_number,roll,teacher_name }= req.params;
    let present=0;
    let name=subject_name;
    let students= await student.find();
    let subjects= await subject.find();  
    let attendances= await attendence.find();
    let date = new Date().toDateString();
    //teacherss=await teachers.findById(id);
    checks=await attendence.find();
    //console.log(branch+" "+subject_name+" "+l_number+" "+roll+" "+date+" "+" "+teacher_name);
    for(let check of checks)
    {
      let branch1 = check.branch;
      let date1 = check.date.toDateString();
      let subject_name1 = check.subject_name;
      let l_number1 = check.l_number;
      let roll1 = check.Present_roll;
      if(date==date1 && l_number==l_number1 && subject_name==subject_name1 && roll==roll1){
        present=present+1;  
      }
    }
   if(present==0){
    console.log("done")
       present = new attendence({
        subject_name: name,
        l_number: l_number,
        branch: branch,
        date: date,
        Present_roll: roll
      });
     await present.save()
    .then(res =>{console.log(present)})
      .catch(err=>{console.log(err)});
    }
    res.render("attendence.ejs",{ students,subjects,branch,teacher_name,name,attendances });
   }); 
   //to update the l_number and l_remaing
   app.post("/l_number/:l_number/:id/:name",async (req,res)=>{
    let {l_number,id,name}=req.params;
    let subjects= await subject.find();
    let l_remaing;
    for(let subject of subjects){
      if(subject.name==name){
         l_remaing=Number(subject.remaing_l)-1;
      }
    }
    let edit_L_number=await subject.findByIdAndUpdate(id,
      {taken_l: l_number}
    );
    let edit_L_remaing=await subject.findByIdAndUpdate(id,
      {remaing_l: l_remaing}
    );
    res.redirect("/");
   });
   //
/*
//to add the subject
app.post("/addsubject",async (req,res)=>{
 let { t_name, clas}=req.body;
 res.redirect("/addsubject/"+t_name+"/"+clas)
 });
 app.get("/addsubject/:tid/:c",async (req,res)=>{
  let {tid,c}=req.params;
  console.log(tid)
  teacher=await teachers.findById(tid);
  res.render("addsub.ejs",{teacher,c})
 });
 app.post("/add_subject/:id/:c",async (req,res)=>{
  let {id,c}=req.params;
  let { sub}=req.body;
  teacher=await teachers.findById(id);
  console.log(teacher.name
  );
  let newsub = new subject({
    name: sub,
    class: c,
    teachers_name: teacher.name
  });
  res.redirect("/HOD");
 await newsub.save()
  .then(res =>{console.log("Added new subject")})
  .catch(err=>{console.log(err)});
  });


 //to see the information of Bcs fy
 app.get("/bcsfy",async (req,res)=>{
  students= await student.find();
  attendances=await attendence.find();
  res.render("bcsfy.ejs",{students});
 });
 
 //to see the information
 app.post("/bcsinfo",async (req,res)=>{
  let {branch} =req.body;
  console.log(branch);
  if(branch=="bcsfy"){
    res.redirect("/bcsfy");
  }
  else if(branch=="bcssy"){
    res.redirect("/bcssy");
  }
 });

//to add new student in class BCS Fy
 app.post("/new_student_bcsfy", async (req,res)=>{
  let {sname, roll}=req.body;
  let new_student_bcsty = new BCS_FY({
    name: sname,
    roll: roll,
    number_of_days_present: 0
  });
  res.redirect("/bcsfy");
 await new_student_bcsty.save()
  .then(res =>{console.log("Added in FY")})
  .catch(err=>{console.log(err)});
});
//to remove student from Bcs fy
app.delete("/bcsfy/:id",async (req,res)=>{
      let { id }= req.params;
       await BCS_FY.findByIdAndDelete(id);
      res.redirect("/bcsfy");
    });

//to edit the name and roll number and name of the student
app.get("/bcsfy/:id/edit",async (req,res)=>{
  let { id }= req.params;
  //console.log(id);
  BCS=await BCS_FY.findById(id);
  res.render("edit.ejs",{BCS});
 });
 app.post("/bcsfy/:id",async (req,res)=>{
  let { id }= req.params;
  let { name, roll}= req.body;
  console.log(name);
  let edit_name=await BCS_FY.findByIdAndUpdate(id,
    {name: name}
  );
  let edit_roll=await BCS_FY.findByIdAndUpdate(id,
    {roll: roll}
  );
  res.redirect("/bcsfy");
 });

//To see the information of Bcs sy
 app.get("/bcssy",async (req,res)=>{
  BCS_SYs=await BCS_SY.find();
  attendances=await attendence.find();
  res.render("bcssy.ejs",{BCS_SYs,attendence});
 });

 //to add new student in bcs sy
 app.post("/new_student_bcssy", async (req,res)=>{
  let {sname, roll}=req.body;
  let new_student_bcssy = new BCS_SY({
    name: sname,
    roll: roll
  });
 await new_student_bcssy.save()
  .then(res =>{console.log("Added in Sy")})
  .catch(err=>{console.log(err)});
  res.redirect("/bcssy");
});
//to edit the name and roll number and name of the student
app.get("/bcssy/:id/edit",async (req,res)=>{
  let { id }= req.params;
  BCS=await BCS_SY.findById(id);
  res.render("edit.ejs",{BCS});
 });
 app.post("/bcssy/:id",async (req,res)=>{
  let { id }= req.params;
  let { name, roll}= req.body;
  console.log(name);
  let edit_name=await BCS_SY.findByIdAndUpdate(id,
    {name: name}
  );
  let edit_roll=await BCS_SY.findByIdAndUpdate(id,
    {roll: roll}
  );
  res.redirect("/bcssy");
 });

// to see the information of Bcs ty
 app.get("/bcsty",async (req,res)=>{
  BCS_TYs=await BCS_TY.find();
  attendances=await attendence.find();
  res.render("bcsty.ejs",{BCS_TYs,attendances});
 });

//to remove student from Bcs ty
app.delete("/bcsty/:id",async (req,res)=>{
      let { id }= req.params;
       await BCS_SY.findByIdAndDelete(id);
      res.redirect("/bcssy");
    });
 //add new student in bcs ty
 app.post("/new_student_bcsty", async (req,res)=>{
  let {sname, roll}=req.body;
  let new_student_bcsty = new BCS_TY({
    name: sname,
    roll: roll
  });
 await new_student_bcsty.save()
  .then(res =>{console.log("Added in TY")})
  .catch(err=>{console.log(err)});
  res.redirect("/bcsty");
});

//to remove student from Bcs ty
app.delete("/bcsty/:id",async (req,res)=>{
  console.log("inside delete route");
      let { id }= req.params;
       await BCS_TY.findByIdAndDelete(id);
      res.redirect("/bcsty");
    });
//to edit the name and roll number and name of the student
app.get("/bcsty/:id/edit",async (req,res)=>{
  let { id }= req.params;
  //console.log(id);
  BCS=await BCS_TY.findById(id);
  res.render("edit.ejs",{BCS});
 });
 app.post("/bcsty/:id",async (req,res)=>{
  let { id }= req.params;
  let { name, roll}= req.body;
  let edit_name=await BCS_TY.findByIdAndUpdate(id,
    {name: name}
  );
  let edit_roll=await BCS_TY.findByIdAndUpdate(id,
    {roll: roll}
  );
  console.log(edit_roll);
  res.redirect("/bcs");
 });

//add new teachers
app.post("/new_teachers", async (req,res)=>{
  let {tname, username, password}=req.body;
  let new_teachers = new teachers({
    name: tname,
    user_name: username,
    password: password
  });
 await new_teachers.save()
  .then(res =>{console.log("Added")})
  .catch(err=>{console.log(err)});
});


//Teachers
//to login form of teachers 
app.get("/teacherlogin",async (req,res)=>{
  teacherss=await teachers.find();
  res.render("teacherlogin.ejs");
 });

 //to check the password enter by the teacher
app.post("/check_pass", async(req, res)=>{
  let {uname,password}=req.body;
  teacherss=await teachers.find();
  console.log(teacherss);
  for(let teachers of teacherss){
    var check= teachers.user_name;
    if(check==uname && teachers.password==password)
    {  
      id= teachers.id;
      res.redirect("/individual_teacher/"+id);
    }
  }
});

//to show the information about the teachers and subject
app.get("/individual_teacher/:id", async(req, res)=>{
  let { id }= req.params;
  teacherss=await teachers.findById(id);
  subjects=await subject.find();
  res.render("individual_teacher.ejs",{teacherss,subjects});
});


//to add the presnt student
app.post("/present/:cls/:count/:id", async(req, res)=>{
  let { cls,count,id }= req.params;
  let present=0;
  let date = new Date().toDateString();
  teacherss=await teachers.findById(id);
  checks=await attendence.find();
  name_of_t=teacherss.name;
  console.log(checks);
  for(let check of checks)
  {
    date1= check.date.toDateString();
    name_of_t1= check.teacher_name;
    cls1= check.cls;
    count1= check.Present_roll;
    if(date==date1 && name_of_t==name_of_t1 && cls==cls1 && count==count1){
      present=present+1;
      console.log(present);
    }
  }
  if(present==0){
    let present = new attendence({
      teacher_name: name_of_t,
      cls: cls,
      date: date,
      Present_roll: count
    });
   await present.save()
  .then(res =>{console.log(res)})
    .catch(err=>{console.log(err)});
  }
  res.redirect("/attendence/"+id+"/"+cls);
 });


//these is to take the attendence
app.post("/attendence/:id",async (req,res)=>{
  let { id }= req.params;
  let { cl }= req.body;
  var cls= cl;
 // attendences=await attendence.find();
  res.redirect("/attendence/"+id+"/"+cls);
 });
 
 app.get("/attendence/:id",async (req,res)=>{
  let { id }= req.params;
  res.redirect("/attendence/"+id+"/"+cls);
 });
 app.get("/attendence/:id/:cls",async (req,res)=>{
  let { id,cls }= req.params;
  let dBCS_FYs=await BCS_FY.find();
  BCS_SYs=await BCS_SY.find();
  BCS_TYs=await BCS_TY.find();
  teacherss=await teachers.findById(id);
  attendances=await attendence.find();
  res.render("attendence.ejs",{BCS_FYs,BCS_SYs,teacherss,BCS_TYs,cls,attendances});
 });*/
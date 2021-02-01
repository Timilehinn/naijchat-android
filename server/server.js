/* 
    @author: Makinde Timilehin (makiaveli)
    @hosted on: heroku as (https://wetune-mobile-back.herokuapp.com)
*/
const { pool } = require("./dbConfig");
require("dotenv").config()
const express = require("express");
const app = express();
const { v4 } = require('uuid');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3333 ;
const cors = require('cors')
const messages=[];
const path = require('path')
const cloudinary = require('cloudinary')
const { formatMessage } = require('./messages')
const moment = require('moment');



cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json({limit: "50mb"}))

io.on("connection", socket => {
  console.log("a user connected server",socket.id);

  socket.on('usr-joined',room=>{
    console.log('you joined this', room)
    socket.join(room);
    socket.broadcast
      .to(room)
      .emit(
        'messageBot',
        'hey everon someon connected'
      );
  })
  socket.on('usr-disconn',msg=>{
    console.log(msg)
  })
  // socket.on("chat message", msg => {
  //   console.log(msg);
  //   io.emit("chat message", msg);
  // });
  function formatMsg(msg){
    return {id:v4,msg}
  }
  socket.on('disconnect',()=>{
    pool.query(`update users set online_socket_id = 'nil' where online_socket_id  = '${socket.id}'`,(err,results)=>{
      if(err) throw err
      console.log('>>>>>>>> socket id', socket.id, 'deleted <<<<<<<<<')
    })
  })

  // socket.on('delete_session_socket',info =>{
  //   console.log(info)
  // })

  socket.on('the-msg', async ({msg,img,user_name,room,verified,email,photoBase64})=>{
  const __src = 'data:image/png;base64,'
    console.log(verified,'here')
    time = moment().format('h:mm a')
      await pool.query(`insert into messages (img,msg_room,is_msg_sender_verified,messages,messages_with_img,email,name,date,time) VALUES ('${img}','${room}','${verified ? verified : false}','${msg.replace(/'/g,"''")}','${__src+photoBase64}','${email}','${user_name}','date','${time}')`,(err,results)=>{
        if(err) throw err
      })
      // messages.unshift({msg,img})
      // console.log(messages)
      io.to(room).emit('app-msg',formatMessage(user_name,img,msg,__src+photoBase64,verified))
    // io.emit('app-msg',formatMsg(v4(),msg))
  })

  socket.on('SAVE_CLIENT_SOCKET_ID',_socketINFO=>{
    pool.query(`update users set online_socket_id = '${_socketINFO.soc_id}' where email= '${_socketINFO.email}'`,(err,results)=>{
      if(err) throw err
      console.log('>>>>>>>> socket id', _socketINFO.email,_socketINFO.soc_id, 'saved <<<<<<<<<')
    })
  })

  
  socket.on('the-dm-msg', async ({msg,img,user_name,user_socket,verified,from,to,photoBase64})=>{
    const __src = 'data:image/png;base64,'
      // console.log(verified,'here')
      time = moment().format('h:mm a')
        await pool.query(`insert into direct_messages (img,sent_from,sent_to,is_msg_sender_verified,messages,messages_with_img,name,date,time) VALUES ('${img}','${from}','${to}','${verified ? verified : false}','${msg.replace(/'/g,"''")}','${__src+photoBase64}','${user_name}','date','${time}')`,(err,results)=>{
          if(err) throw err
        })
        // messages.unshift({msg,img})
        // console.log(messages)
        // io.to(room).emit('app-msg',formatMessage(user_name,img,msg,__src+photoBase64,verified))
        console.log(user_socket)
        io.to(user_socket).emit('server_dm_msg',formatMessage(user_name,img,msg,__src+photoBase64,verified))
      // io.emit('app-msg',formatMsg(v4(),msg))
    })
  })
// app.use(cors())

app.get('/topics',async(req,res)=>{
  pool.query('select * from topics order by id desc limit 15',async(err,results)=>{
    if(err) throw err
    res.json(results.rows)
  })
    // res.send('wetune')
})

app.get('/get-profile-topics',(req,res)=>{
  pool.query(`select * from topics where creator_email = '${req.query.email}' order by id desc limit 15 `,(err,results)=>{
    if(err) throw err
    // console.log(results.rows)
    res.json({profile_topics:results.rows})
  })
    // res.send('wetune')
})

app.get('/search-topics',(req,res)=>{
  pool.query('select * from topics order by id desc',(err,results)=>{
    if(err) throw err
    // console.log(results.rows)
    res.json(results.rows)
  })
    // res.send('wetune')
})

app.get('/dm-search-users',(req,res)=>{
  pool.query(`select * from users where email != '${req.query.curr_user}' order by id desc`,(err,results)=>{
    if(err) throw err
    console.log(results.rows)
    res.json(results.rows)
  })
    // res.send('wetune')
})

app.get('/more-topics',(req,res)=>{
  console.log(req.query.off)
  // offset += 10
  pool.query(`select * from topics order by id desc LIMIT 10 OFFSET ${req.query.off}`, (err,results)=>{
      if(err){
          throw err
      }
  // res.render('pacblog', {posts:results.rows})res.
  res.json(results.rows)
  })
})

app.get('/messages',(req,res)=>{
  pool.query(`select * from messages where msg_room='${req.query.slug}' order by id desc limit 10`,(err,results)=>{
    if(err) throw err
    console.log(req.query.slug)
    res.json(results.rows)
  })
    // res.send('wetune')
})


app.get('/direct_messages',async (req,res)=>{
  // sent_from = await pool.query(`select * from direct_messages where sent_from='${req.query.email}' order by id desc limit 10`)
  // sent_to = await pool.query(`select * from direct_messages where sent_to='${req.query.email}' order by id desc limit 10`)
    // res.send('wetune')
    res.json({dms:[]})
    // res.json({dms:[...sent_from.rows,...sent_to.rows]})
    // console.log([...sent_from.rows,...sent_to.rows])
    // console.log(sent_to.rows)
})

app.get('/api/login',(req,res)=>{
  console.log(req.query)
  pool.query('select * from users where email = $1',[req.query.email],(err,results)=>{
    // res.json({details:results.rows})
    console.log(results.rows)
  })
})

app.get('/api/profile',(req,res)=>{
  console.log(req.query)
  pool.query(`select * from users where email = '${req.query.email}'`,(err,results)=>{
    if(err) throw err
    res.json({profile:results.rows})
    // console.log(results.rows[0].fullname,results.rows[0].email)
  })
})

app.post('/register',(req,res)=>{
  // console.log(req.body)
  const { email,name,password } = req.body
  const image = "/img/user-circle.svg"
  pool.query(`SELECT * FROM users where email = $1`,[email],(err,results)=>{
    if(err) throw err
    if(results.rows.length > 0){
      // req.flash('email_already_reg','The email is already registered.')
      // res.redirect('/')
      res.json({msg:'The email is already registered',success:false})
    }else{
      pool.query(`INSERT INTO users (email,fullname,password,img,verified)
      VALUES ('${email.toLowerCase()}','${name}','${password}','${image}','false')`,(err,results)=>{
        if(err) throw err
        // req.flash('account_created','Registration successful, Sign In.')
        // res.redirect('/')
        res.json({msg:'registered successfully, Login to continue.',success:true})
      })
    }
  })
})


app.post('/api/login',(req,res)=>{
  pool.query('select * from users where email = $1',[req.body.email.toLowerCase()],(err,results)=>{
    if(err) throw err
    if(results.rows.length === 0){
        res.json({auth_msg:'no user with that email address',session:false,email:req.body.email})
    }else if(results.rows[0].password !== req.body.password){
        res.json({auth_msg:'password is incorrect',session:false,email:req.body.email})
    }else{
        session = true
        authEmail = req.body.email
        res.json({auth_msg:'login successful.',session:true,email:authEmail,details:results.rows})
        // console.log(results.rows)
    }
  })
})


app.post('/create-topic', async (req,res)=>{
  const { title,post,photoBase64,creator_img,creator,verified,creator_email } = req.body
  // console.log(await req.body.photoBase64.substring(0,50))
  const __src = 'data:image/png;base64,'
  console.log(creator_email,'from creat topic')
  // res.json({from_me:'i recied it'})
  // const files = req.files
  // title
  // console.log(title)
  // const img = JSON.stringify(files[0]["filename"]).replace(/"/g,'')
  const slugId = Math.ceil(Math.random()*100000000)
  const slug = slugId+'-'+title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  view_zero = 0;
  time = moment().format('h:mm a')
  date = moment().format('DD-MM-YY')
  // /////
  //  //UPLOADING FILE
  //  await cloudinary.uploader.upload(req.body.photo.uri, result=>{
  //   console.log('the', result)
  //   let img_cdn_url = result['url']
  //  })
    pool.query(`INSERT INTO topics (title,slug,img,creator_img,creator,creator_email,is_poster_verified,views,date,time,topic_body) 
    VALUES ('${title.replace(/'/g,"''")}','${slug}','${__src+photoBase64}','${creator_img}','${creator}','${creator_email}',${verified},'${view_zero}','${date}','${time}','${post.replace(/'/g,"''")}')`,(err,results)=>{
      if(err) {
        res.json({msg:'An error occured, try again.',success:false})
        throw err
      }else{
        res.json({msg:'Topic published.',success:true})
      }
    })
})

app.post('/update-profile-image',(req,res)=>{
  console.log(req.body.photoBase64.substring(0,50))
 const { photoBase64,id,creator_email} = req.body
 console.log(creator_email)
  console.log('timi')
  // console.log('timi')
  __src = 'data:image/png;base64,'
  pool.query(`UPDATE users SET img = '${__src+photoBase64}' WHERE id = ${id}`,(err,results)=>{
    if(err) {
      res.json({msg:'update failed',success:false})

    }else{
      res.json({msg:'Profile picture changed',success:true})
      pool.query(`update topics set creator_img = '${__src+photoBase64}' where creator_email='${creator_email}'`,(err,results)=>{
        if(err) throw err
      })
      pool.query(`update messages set img = '${__src+photoBase64}' where email='${creator_email}'`,(err,results)=>{
        if(err) throw err
        console.log('msg image changeds')
      })

    }
  })
})


app.post('/update-profile', async (req,res)=>{
  const { id,fullname,email } =req.body
  pool.query(`UPDATE users SET fullname = '${fullname}' WHERE id = ${id}`,(err,results)=>{
    if(err){
      res.json({msg:'An error occurred, try again',success:false})
    }else{
      res.json({msg:'Display name changed',success:true})
    }
  })
    // pool.query(`UPDATE users SET fullname = '${fullname}',email = '${email.toLowerCase()}' WHERE id = ${id}`,(err,results)=>{
    //   if(err){
    //     res.json({msg:'An error occurred, the email might be registered already.',success:false})
    //     throw err
    //   }else{
    //     res.json({msg:'Profile Name and Email Updated.',success:true})
    //   }
    // })
})

server.listen(PORT, () => console.log("server running on port:" + PORT));
const express = require("express");

const router = express.Router();

const Posts = require("./postModel");

router.use(express.json());

//GET post request returns all posts
router.get(`/`, (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({message: "Error retrieveing posts"})
    })
})

//GET post with findById() client search by id returns post by id
router.get(`/:id`, (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if(post) {
            res.status(200).json(post)
        }else {
            res.status(404).json({message: "Post not found"});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error getting that post",
        })
    })
})


//Get Posts comments using the findPostComments fuction targeting /id/comments to get the comments by thier id... maybe idk study more dumdum
router.get("/:id/comments", (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comments => {
        if(comments) {
            res.status(200).json(comments)
        }else {
            res.status(404).json({message: "comment by that id was not found"})
        }
    })
    .catch((error) => {
        console.log("error retrieveing comments", error);
        res.status(500).json({
            errorMessage: "there wasn an error trying to retrieve that comment info"
        })
     
    })
})

/// Posting a comment to a post using the the comments post id param.
///then using the insertComment fuction maybe a method idk post teh comment or insert then alos findPostsComments find the post comments again by post id then post new post...
/// MAYBE LOL
router.post("/:id/comments", (req, res) => {
    const comments = req.body;
    if (!comments.text) {
        res.status(400).json({ errorMessage:"you need to provide a text field."})
    }else {
        comments.post_id = req.params.id;
        Posts.insertComment(comments)
        .then((comments) => {
            Posts.findPostComments(comments)
            .then((posts) => {
                res.status(201).json(posts);
            })
        })
        .catch((error) => {
            console.log("error on the POST no text field", error);
            res.status(500).json({
                errorMessage: " There was an error while saving the comment"
            })
        })
    }
})
// router.post("/", (req, res) => {
//     Posts.insert(req.body)
//     .then(post => {
//         res.status(201).json(post)

//     })
// })


///creatign a new post using the .insert() method post needs a title and contents or throws an 400 err
router.post("/", (req, res) => {
    const posts = req.body;
    if(!posts.title || !posts.contents) {
        res.status(400).json({errorMessage: "please provide title and contents for the post"})
    }else {
        Posts
        .insert(posts)
        .then(({id}) => {
            Posts.findById(id)
            .then((post) => {
                res.status(201).json(post)

            })
        })
        
        
    }
})

router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
    .then(removed => {
        if(removed) {
            res.status(404).json({message: "post deleted", removed})
        }else{
            res.status(200).json({message: "post not found"})
        }
    })
    
})

// router.put("/:id", (req, res) => {
//     const post = req.body;
//     if(!post.title || !post.contents) {
//         res.status(400).json(
//             {errorMessage: "please provide title and contents for the post"})
//     }else {
//         Posts
//         .update(post)
//         console.log(post)
//         .then(({id}) => {
//             Posts.findById(id)
//             .then((post) => {res.status(201).json(post)})
            
//         })
//     }
// })
router.put('/:id', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({errorMessage: "please provide title and contents for the post"})
    } 
    Posts
    .update(req.params.id, req.body)
    .then(count => {
        if (count > 0) {
            Posts.findById(req.params.id)
            .then((post) => {
                res.status(200).json(post)
            })  
        }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error updating the post'
        });
    });
});
module.exports = router;
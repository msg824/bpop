const express = require('express');
const router = express.Router();
const models = require('../models');
const multer = require('multer');
const upload = multer({dest: './uploads'});

const Posting = models.posting;

//포스팅 회원가입 정보가 들어올때 검사하는 곳
router.get('/', async(req,res,next) => {
    try {
        const postingdata = await Posting.findAll({
            order: [
                ['post_id', 'DESC']
            ],
            limit: 5
        });

        res.send(postingdata);
    } 
    catch(err){
        console.error(err);
        next(err);
    }
    
});

//포스팅 정보 DB에 저장
function posting_insert(posting_data, postimg, writer) {
    try {
        if(postimg[1]==null){
            const result = Posting.create({
                image: '/uploads/' + postimg[0].filename,
                top_tag : posting_data.top_tag,
                outer_tag : posting_data.outer_tag,
                bottom_tag : posting_data.bottom_tag,
                shoes_tag : posting_data.shoes_tag,
                content : posting_data.content,
                writer: writer
            });
            return result
        }
        if(postimg[2]==null){
            const result = Posting.create({
                image: '/uploads/' + postimg[0].filename,
                image2: '/uploads/' + postimg[1].filename,
                top_tag : posting_data.top_tag,
                outer_tag : posting_data.outer_tag,
                bottom_tag : posting_data.bottom_tag,
                shoes_tag : posting_data.shoes_tag,
                content : posting_data.content,
                writer: writer
            });
            return result
        }
        else{
            const result = Posting.create({
                image: '/uploads/' + postimg[0].filename,
                image2: '/uploads/' + postimg[1].filename,
                image3: '/uploads/' + postimg[2].filename,
                top_tag : posting_data.top_tag,
                outer_tag : posting_data.outer_tag,
                bottom_tag : posting_data.bottom_tag,
                shoes_tag : posting_data.shoes_tag,
                content : posting_data.content,
                writer: writer
            });
            return result
        }
        
    } catch (err) {
        console.error('Posting DB Insert err', err);
    }
}

router.post('/insert',upload.array('images',3), (req, res,next) => {
    const result = posting_insert(req.body, req.files, req.query.writer);

    console.log('AAA', req.query.writer);

    console.log('첫번째 사진', req.files[0]);
    console.log('두번째 사진', req.files[1]);
    console.log('세번째 사진', req.files[2]);
    console.log(req.body.images);
    // console.log(req.body.outer_tag);
    console.log("데이터삽입 성공");
    res.send(result);
});

// top-tag
router.post('/top-tag-all', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            top_tag: ['short-Tee', 'shirt', 'hood-shirt', 'sweatshirt', 'top-etc']
        }
    });

    res.send(result);
})
router.post('/top-tag', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            top_tag: req.query.tag
        }
    });

    res.send(result);
})

// outer-tag
router.post('/outer-tag-all', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            outer_tag: ['coat', 'hood-zip-up', 'cardigan', 'jacket', 'padding']
        }
    });

    res.send(result);
})
router.post('/outer-tag', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            outer_tag: req.query.tag
        }
    });

    res.send(result);
})

// bottom-tag
router.post('/bottom-tag-all', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            bottom_tag: ['Denim', 'skirt', 'slacks', 'leggings', 'bottom-etc']
        }
    });

    res.send(result);
})
router.post('/bottom-tag', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            bottom_tag: req.query.tag
        }
    });

    res.send(result);
})

// shoes-tag
router.post('/shoes-tag-all', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            shoes_tag: ['running-shoes', 'shoes', 'sneakers', 'sandal', 'shoes-etc']
        }
    });

    res.send(result);
})
router.post('/shoes-tag', async(req, res) => {
    const result = await Posting.findAll({
        where: {
            shoes_tag: req.query.tag
        }
    });

    res.send(result);
})

module.exports = router;
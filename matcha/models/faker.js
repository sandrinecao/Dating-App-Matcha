const faker = require('faker/locale/en');
const passwordHash = require("password-hash");
const randomLocation = require('random-location');
const pool = require('../config/connection');
var dateformat = require('dateformat');

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}


async function matchAppFaker(req, res) {
    try {
        console.log("Clean Database...");
        // CLEAN DATABASE ---------------------------------------------

        let texts = [
            "DELETE FROM blocks WHERE 1 = 1;",
            "DELETE FROM images WHERE 1 = 1;",
            "DELETE FROM likes WHERE 1 = 1;",
            "DELETE FROM messages WHERE 1 = 1;",
            "DELETE FROM notifications WHERE 1 = 1;",
          
            "DELETE FROM users WHERE 1 = 1",
            "DELETE FROM user_tags WHERE 1 = 1"
        ];
        texts.map(async (request) => { await pool.query(request) });

        // GENERATE 4000 INTERESTS ------------------------------------
        // RESET SEQUENCE
        // let text = 'ALTER SEQUENCE interests_id_seq RESTART WITH 1';
        // await pool.query(text);
        // for (let i = 0; i < 2000; i++) {
        //     console.log("Add " + i + " sexpref");
        //     let interest = faker.random.word();
        //     let text = 'SELECT * FROM users WHERE sexpref = $1 LIMIT 1';
        //     let response = await pool.query(text, [interest]);
        //     if (response.rows && response.rows.length)
        //         continue;
        //     else {
        //         text = 'INSERT INTO users(sexpref) SELECT $1 ON CONFLICT DO NOTHING';
        //         await pool.query(text, [interest]);
        //     }
        // }
        // GENERATE 500 USERS -----------------------------------------
        // RESET SEQUENCE
        text = 'ALTER TABLE users AUTO_INCREMENT = 1';

        await pool.query(text);
        // for (let i = 1; i < 550; i++) {
        for (let i = 2; i < 501; i++) {
            const P = {
                latitude: 48.9060765, 
                longitude: 2.3149116999999997
            };
            
            const R = 501000;// meters
            console.log("Add " + i + " users");
            let gender = ["Man", "Woman"];
            let interested = ["Homosexual", "Homosexual", "Pansexual", "Heterosexual", "Bisexual"];
           
            const randomPoint = randomLocation.randomCirclePoint(P, R)
            const text = 'INSERT INTO users SET userId = ?, firstName = ?, lastName = ?, age = ?, username = ?, email = ?,password = ?, gender = ?, bio = ?, sexpref = ?, geoloc = ?, position = ?, lastConnection = ?, tokenmail = ?, mail_active = ?';
            const values = [
                i,
                faker.name.firstName(),
                faker.name.lastName(),
                calcAge(faker.date.between('1970-01-01T11:25:19.644Z', '2000-01-01T11:25:19.644Z')),
                faker.internet.userName(),
                faker.internet.email(),
                passwordHash.generate(faker.internet.password()),
                gender[Math.round(Math.random())],
                "J'aime la vie",
                // interested[Math.floor(Math.random() * 3) + 1],
                interested[Math.floor(Math.random() * 4) + 1],
                randomPoint.latitude + ', ' + randomPoint.longitude,
                "1",
                dateformat("mediumDate"),
                "cc45bb3397be8523261c196652d7604c",
                "1",
            ];
            await pool.query(text, [values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12], values[13], values[14]], function (err) {
                if (err) console.log(err, "SOMETHING WENT WRONG");
            })
        }

        // GENERATE USERS PICTURES -----------------------------------
        text = 'ALTER TABLE images AUTO_INCREMENT = 1';


        function genderSelect() {
            let randomIdx = Math.floor(Math.random() * 2);
            if (randomIdx !== 1) {
                return "male"
            } else {
                return "female";
            }
        }

        await pool.query(text);
        // for (let i = 1; i < 550; i++) {
        for (let i = 2; i < 501; i++) {
            let randomGender = genderSelect();
            let photoGender = '';
            let photoNo = Math.floor(Math.random() * 99);
            if (randomGender === "male") photoGender = "men";
            if (randomGender === "female") photoGender = "women"

            console.log("Add Picture for user " + i);
            const text = 'INSERT INTO images SET id = ?, name =?, userId = ? ,profil = ?';
            // const values = [i, faker.image.avatar(), i, 1];
            const values = [i, `https://randomuser.me/api/portraits/${photoGender}/${photoNo}.jpg`, i, 1];
            await pool.query(text, values, function (err) {
                if (err) console.log(err, "SOMETHING WENT WRONG");
            })
        }

        // GENERATE USERS_tags -----------------------------------
        text = 'ALTER TABLE user_tags AUTO_INCREMENT = 1';
        await pool.query(text);
        for (let i = 2; i < 501; i++) {
            // for (let i = 1; i < 550; i++) {
            console.log("Add tags for user " + i);
            for (let j = 0; j < 3; j++) {
                const text = 'INSERT INTO user_tags SET userId =?, tagId = ?';
                const values = [i, faker.random.number({ min: 1, max: 10 })]
                await pool.query(text, values, function (err) {
                    if (err) console.log(err, "SOMETHING WENT WRONG");
                })
            }
        }

        // // GENERATE USERS INTERESTS -----------------------------------
        // text = 'SELECT * FROM INTERESTS WHERE 1 = 1';
        // let response = await pool.query(text);
        // let maxMathRandom = response.rows.length;
        // for (let i = 0; i < 500; i++) {
        //     console.log("Add interests for user " + i);
        //     for (let j = 0; j < 30; j++) {
        //         const text = 'INSERT INTO user_interests(user_id, interest_id) VALUES ($1, $2);';
        //         const values = [i, Math.floor(Math.random() * maxMathRandom) + 1];
        //         await pool.query(text, values);
        //     }
        // }
        //     // GENERATE USERS COMPLETE  -----------------------------------
        //     for (let i = 0; i < 500; i++) {
        //         console.log("Generate user complete " + i + " of 1000");
        //         const text = 'INSERT INTO user_complete(complete_basics, complete_photos, complete_interets, user_id) VALUES ($1, $2, $3, $4);';
        //         const values = [30, 40, 30, i];
        //         await pool.query(text, values);
        //     }
        //  
        // GENERATE USERS PICTURES  -----------------------------------
        // RESET SEQUENCE
        // text = 'ALTER SEQUENCE pictures_img_id_seq RESTART WITH 1';
        // await pool.query(text);
        // for (let i = 0; i < 500; i++) {
        //     console.log("Generate user pictures " + i + " of 1000");
        //     for (let j = 0; j < 5; j++) {
        //         const text = 'INSERT INTO pictures(img_link, user_id, img_order) VALUES ($1, $2, $3)';
        //         const values = [faker.image.avatar(), i, j];
        //         await pool.query(text, values);
        //     }
        // }

        //     // GENERATE LIKES
        //     console.log("Generate likes...");
        //     for (let i = 0; i < 10000; i++) {
        //         console.log([i, " of 10000..."]);
        //         let text = 'INSERT INTO user_likes(user_id_like, user_id_liked) VALUES ($1, $2)';
        //         let user_id_like = Math.floor(Math.random() * 1000) + 1;
        //         let user_id_liked = Math.floor(Math.random() * 1000) + 1;
        //         if (user_id_like !== user_id_liked) {
        //             let values = [user_id_like, user_id_liked];
        //             await pool.query(text, values);
        //             // Get number of like on profile
        //             text = 'SELECT likes FROM profile WHERE user_id = $1;';
        //             values = [user_id_liked];
        //             await pool.query(text,values);
        //             // Add like
        //             text = 'UPDATE profile SET likes = likes + 1 WHERE user_id = $1;'
        //             values = [user_id_liked]
        //             await pool.query(text, values);
        //         }
        //     }
        //     // Insert user --- USER 1
        //     text = 'INSERT INTO users(user_id, username, email, password, active, complete) VALUES ($1, $2, $3, $4, $5, $6)';
        //     await pool.query(text, [1001, "user1", "user1@gmail.com", "sha1$f198d198$1$ed7ef79a0d7a58dc5e6350d215338cc3dd62ac0f", 1, 39]);
        //     // Generate profile
        //     text = 'INSERT INTO profile(user_id, lastname, firstname, gender, interested, country, bio, likes, age, usecustomaddress, last_date_online, online, geolocate, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        //     await pool.query(text, [1001, 'Dupont', 'Patrick', 'male', 'heterosexual', 'France', 'Hi, my name is Patrick !', 1, 18, 0, '2020-02-15 12:53:23.109+01', 0, 0, null, null]);
        //     // Interests USER 1
        //     text = 'INSERT INTO user_interests(user_id, interest_id) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8)';
        //     await pool.query(text, [1001, 800, 1001, 850, 1001, 830, 1001, 802]);
        //     // Insert in matched user
        //     text = 'INSERT INTO matchedusers(user_id, user_id2) VALUES ($1, $2)';
        //     await pool.query(text, [1002, 1001]);
        //     // Insert Imgs
        //     text = 'INSERT INTO pictures(img_link, user_id, img_order) VALUES ($1, $2, $3)';
        //     await pool.query(text, [process.env.SERVER_LOCALHOST !== JSON.stringify(true) ? 'https://matchappli.herokuapp.com/assets/img/patrick-dupont.png' : 'http://localhost:5000/assets/img/patrick-dupont.png', 1001, 0]);
        //     // Insert complete
        //     text = 'INSERT INTO user_complete(complete_basics, complete_photos, complete_interets, user_id, complete_location) VALUES ($1, $2, $3, $4, $5)';
        //     await pool.query(text, [30, 5, 4, 1001, null]);
        //     // Insert likes
        //     text = 'INSERT INTO user_likes(user_id_like, user_id_liked) VALUES ($1, $2), ($3, $4)';
        //     await pool.query(text, [1002, 1001, 1001, 1002]);
        //     // Insert user --- USER 2
        //     text = 'INSERT INTO users(user_id, username, email, password, active, complete, tokenmail) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        //     await pool.query(text, [1002, "user2", "user2@gmail.com", "sha1$f198d198$1$ed7ef79a0d7a58dc5e6350d215338cc3dd62ac0f", 1, 39, null]);
        //     // Generate profile
        //     text = 'INSERT INTO profile(user_id, lastname, firstname, gender, interested, country, bio, likes, age, usecustomaddress, last_date_online, online, geolocate, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        //     await pool.query(text,[1002, 'Pontdu', 'Marine', 'female', 'heterosexual', 'France', 'Hi, my name is Marine !', 1, 18, 0, '2020-02-15 12:53:23.109+01', 0, 0, null, null]);
        //     // Interests USER 2
        //     text = 'INSERT INTO user_interests(user_id, interest_id) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8)';
        //     await pool.query(text, [1002, 890, 1002, 850, 1002, 830, 1002, 802]);
        //     // Insert Imgs
        //     text = 'INSERT INTO pictures(img_link, user_id, img_order) VALUES ($1, $2, $3)';
        //     await pool.query(text, [process.env.SERVER_LOCALHOST !== JSON.stringify(true) ? 'https://matchappli.herokuapp.com/assets/img/marine-dupont.png' : 'http://localhost:5000/assets/img/marine-dupont.png', 1002, 0]);
        //     // Insert complete
        //     text = 'INSERT INTO user_complete(complete_basics, complete_photos, complete_interets, user_id, complete_location) VALUES ($1, $2, $3, $4, $5)';
        //     await pool.query(text, [30, 5, 4, 1002, null]);

        //     // Insert Admin
        //     // Insert user --- USER 2
        //     text = 'INSERT INTO users(user_id, username, email, password, active, complete, tokenmail, admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
        //     await pool.query(text, [1003, "admin", "admin@gmail.com", "sha1$678115e2$1$1e55f85a4c5c1c15d43787868eb147528a270a5f", 1, 150, null, 1]);
        //     // Generate profile
        //     text = 'INSERT INTO profile(user_id, lastname, firstname, gender, interested, country, bio, likes, age, usecustomaddress, last_date_online, online, geolocate, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        //     await pool.query(text,[1003, 'Admin', 'Admin', 'special', 'special', 'France', 'Hi, my name is JV !', 1, 18, 0, '2020-02-15 12:53:23.109+01', 0, 0, null, null]);
        //     // Insert Imgs
        //     text = 'INSERT INTO pictures(img_link, user_id, img_order) VALUES ($1, $2, $3)';
        //     await pool.query(text, ["https://react.semantic-ui.com/images/wireframe/white-image.png", 1003, 0]);
        //     // Insert complete
        //     text = 'INSERT INTO user_complete(complete_basics, complete_photos, complete_interets, user_id, complete_location) VALUES ($1, $2, $3, $4, $5)';
        //     await pool.query(text, [50, 50, 50, 1003, null]);
        //     return res.status(200).json({
        //         warnings: ["1002 profiles were successfully created"]
        //     })
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            warnings: ["Error during create profiles.."]
        })
    }
}

exports.matchAppFaker = matchAppFaker;
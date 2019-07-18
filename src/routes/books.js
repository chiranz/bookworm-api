import express from "express";
import authenticate from "../middlewares/authenticate";
import request from "request-promise";
import { parseString } from "xml2js";

const router = express.Router();
router.use(authenticate);
router.get("/search", (req, res) => {
  request
    .get(
      `https://www.goodreads.com/search/index.xml?key=${
        process.env.GOODREAD_KEY
      }&q=${req.query.q}`
    )
    .then(result =>
      parseString(result, (err, goodreadsResult) =>
        res.json({
          books: goodreadsResult.GoodreadsResponse.search[0].results[0].work.map(
            work => ({
              goodreadsId: work.best_book[0].id[0]._,
              title: work.best_book[0].title[0],
              authors: work.best_book[0].author[0].name[0],
              covers: [work.best_book[0].image_url[0]]
            })
          )
        })
      )
    );

  // res.json({
  // books: [
  //   {
  //     goodreadsId: 1,
  //     title: "Conman Autobiography",
  //     authors: "Chiranjibi",
  //     covers: [
  //       "https://picsum.photos/id/781/200/200",
  //       "https://picsum.photos/id/368/200/200"
  //     ],
  //     pages: 200
  //   },
  //   {
  //     goodreadsId: 2,
  //     title: "Bio of Chiran",
  //     authors: "Chiranjibi",
  //     covers: [
  //       "https://picsum.photos/id/781/200/200",
  //       "https://picsum.photos/id/368/200/200"
  //     ],
  //     pages: 300
  //   }
  // ]
  // });
});

export default router;

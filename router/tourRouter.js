import fs from "fs";
import express from "express";

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

const tourRouter = express.Router();

const checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (val > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: `Tour with ID: ${val} not found`,
    });
  }
  next();
};

const validationBody = (req, res, next) => {
  console.log(req.body);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

tourRouter.param("id", checkID);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  const id = Number(req.params.id);

  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  Object.assign(tour, req.body);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  console.log(newTour);
  tours.push(newTour);
  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: `Tour with ID: ${id} not found`,
    });
  }
  Object.assign(tour, req.body);
  res.status(200).json({
    status: "success",
    message: "updated success",
  });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex((el) => el.id === id);

  tours.splice(tourIndex, 1);
  res.status(204).json({
    status: "success",
    data: null,
  });
};

tourRouter.route("/").get(getAllTours).post(validationBody, createTour);
tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

export default tourRouter;

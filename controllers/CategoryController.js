const fs = require("fs");
const Category = require("../models/Category");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const { paginate } = require("../utils/Helpers");
const path = require("path");
const deleteFile = require("../utils/File");


const browseCategories = async function (req, res, next) {
  try {
    const { page, limit, skip } = paginate(req);

    const categories = await Category.find().skip(skip).limit(limit);

    const countDocs = await Category.countDocuments();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        categories,
        pagination: {
          total: countDocs,
          page,
          pages: Math.ceil(countDocs / limit),
          limit,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

const addCategory = async function (req, res, next) {
  try {
    const category = new Category({
      name: req.body.name,
      image: req.file ? req.file.path : "",
    });

    await category.save();

    return res.status(Constants.STATUSCODE.CREATED).json(
      Jsend.success({
        message: "Category created",
        category,
      }),
    );
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(Constants.STATUSCODE.NOT_FOUND)
        .json(Jsend.fail({ message: "Category not found" }));

    return res
      .status(Constants.STATUSCODE.SUCCESS)
      .json(Jsend.success({ category }));
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(Constants.STATUSCODE.NOT_FOUND)
            .json(Jsend.fail({ message: "Category not found" }));

        if (req.body.name !== undefined) category.name = req.body.name;

        if (req.file) {
            if (category.image) {
                const oldPath = path.join("uploads", "categories", category.image);
                deleteFile(oldPath);
            }
            category.image = req.file.filename;
        }

        await category.save();

        return res.status(Constants.STATUSCODE.SUCCESS).json(
            Jsend.success({
                message: "Category updated",
                category: {
                    ...category._doc,
                    image: category.image ? `/uploads/categories/${category.image}` : null
                }
            })
        );
    } catch (error) { next(error); }
};


const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(Constants.STATUSCODE.NOT_FOUND)
            .json(Jsend.fail({ message: "Category not found" }));

        // delete image
        if (category.image) {
            const oldPath = path.join("uploads", "categories", category.image);
            deleteFile(oldPath);
        }

        await Category.findByIdAndDelete(req.params.id);

        return res.status(Constants.STATUSCODE.SUCCESS)
            .json(Jsend.success({ message: "Category deleted" }));
    } catch (error) { next(error); }
};

module.exports = {
  browseCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

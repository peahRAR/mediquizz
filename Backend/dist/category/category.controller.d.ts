import { CategoryService } from './category.service';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    findAll(): Promise<import("./category.entity").Category[]>;
    findOne(id: number): Promise<import("./category.entity").Category>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<import("./category.entity").Category>;
    remove(id: number): Promise<void>;
}

export interface ICrudService<T, S> {
  getAll(): Promise<T[]>
  getById(id: number): Promise<T | null>
  create(dto: S): Promise<T>
  update(id: number, dto: S): Promise<T | null>
  delete(id: number): Promise<void>
}

const modules = import.meta.glob('./data/*.js', { eager: true, import: 'default' })
export const templates = Object.values(modules)
  .sort((a, b) => a.name.localeCompare(b.name))

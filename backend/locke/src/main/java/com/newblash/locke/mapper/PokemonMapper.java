package com.newblash.locke.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.newblash.locke.entity.Pokemon;

@Mapper
public interface PokemonMapper extends BaseMapper<Pokemon> {
    
    // 继承 BaseMapper 后，你已经拥有了以下常用方法，无需写任何代码：
    // insert(T entity)           // 插入一条记录
    // deleteById(Serializable id) // 根据 ID 删除
    // updateById(T entity)       // 根据 ID 修改（自动忽略 null 字段，实现动态更新！）
    // selectById(Serializable id) // 根据 ID 查询
    // selectList(Wrapper<T> queryWrapper) // 条件查询列表
    // selectPage(Page<T> page, Wrapper<T> queryWrapper) // 分页查询
    // ... 等等共 17+ 个通用方法
    
    // =========================================================
    // 只有遇到多表联查，或者极其复杂的动态 SQL 时，你才需要在这里自定义方法！
    // 例如：根据名字模糊查询并按速度降序 (MP的Wrapper也能做，这里仅作演示)
    // @Select("SELECT * FROM pokemons WHERE name LIKE #{name} ORDER BY base_speed DESC")
    // List<Pokemon> customSelectByName(@Param("name") String name);
    // =========================================================
}

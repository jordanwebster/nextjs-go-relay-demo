// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
)

func (t *Task) Parent(ctx context.Context) (*Task, error) {
	result, err := t.Edges.ParentOrErr()
	if IsNotLoaded(err) {
		result, err = t.QueryParent().Only(ctx)
	}
	return result, MaskNotFound(err)
}

func (t *Task) Children(
	ctx context.Context, after *Cursor, first *int, before *Cursor, last *int, orderBy []*TaskOrder,
) (*TaskConnection, error) {
	opts := []TaskPaginateOption{
		WithTaskOrder(orderBy),
	}
	alias := graphql.GetFieldContext(ctx).Field.Alias
	totalCount, hasTotalCount := t.Edges.totalCount[1][alias]
	if nodes, err := t.NamedChildren(alias); err == nil || hasTotalCount {
		pager, err := newTaskPager(opts, last != nil)
		if err != nil {
			return nil, err
		}
		conn := &TaskConnection{Edges: []*TaskEdge{}, TotalCount: totalCount}
		conn.build(nodes, pager, after, first, before, last)
		return conn, nil
	}
	return t.QueryChildren().Paginate(ctx, after, first, before, last, opts...)
}

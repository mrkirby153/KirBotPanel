<?php


namespace App\Models;


use App\Exceptions\DeletableRelationsException;

trait DeletesRelations {

    public static function bootDeletesRelations() {
        static::deleting(function ($model) {
            if (!$model->deletableRelationsExists())
                throw new DeletableRelationsException("Model " . get_class($model) . " is missing deletableRelations key.");
            $model->deleteRelations();
        });
    }

    /**
     * Gets the relations of the
     * @return mixed
     */
    protected function getDeletableRelations() {
        return $this->deletableRelations;
    }

    /**
     * @return bool
     */
    public function deletableRelationsExists() {
        return property_exists($this, 'deletableRelations');
    }

    /**
     * @throws DeletableRelationsException
     */
    public function deleteRelations() {
        \Log::debug("Deleting relations for ".get_class($this));
        if (!$this->deletableRelationsExists()) {
            throw new DeletableRelationsException("Model " . get_class($this) . " is missing deletableRelations key.");
        }
        foreach ($this->getDeletableRelations() as $relation) {
            \Log::debug("Deleting relation $relation");
            $relation = $this->$relation();
            $related = $relation->getRelated();
            if(in_array(DeletesRelations::class, class_uses($related))){
                \Log::debug("Relation is deletable, deleting...");
                $related->deleteRelations();
            }
            $relation->delete();
        }
    }
}
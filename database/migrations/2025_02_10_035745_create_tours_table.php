<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->timestamps();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->integer('duration');
            $table->integer('max_group_size');
            $table->enum('difficulty', ['easy', 'moderate', 'hard'])->default('easy');
            $table->bigInteger('price');
            $table->integer('discount_percentage')->nullable();
            $table->float('ratings_avg')->nullable();
            $table->integer('ratings_qty')->nullable();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};

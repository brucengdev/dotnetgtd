using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddFKsItemTagMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ItemTagMappings_TagId",
                table: "ItemTagMappings",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemTagMappings_Tags_TagId",
                table: "ItemTagMappings",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemTagMappings_Tags_TagId",
                table: "ItemTagMappings");

            migrationBuilder.DropIndex(
                name: "IX_ItemTagMappings_TagId",
                table: "ItemTagMappings");
        }
    }
}

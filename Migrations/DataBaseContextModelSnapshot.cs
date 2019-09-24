﻿// <auto-generated />
using System;
using MAS.Payments.DataBase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MAS.Payments.Migrations
{
    [DbContext(typeof(DataBaseContext))]
    partial class DataBaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MAS.Payments.DataBase.MeterMeasurement", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long?>("AuthorId");

                    b.Property<string>("Comment");

                    b.Property<DateTime>("Date");

                    b.Property<bool>("IsSent");

                    b.Property<double>("Measurement");

                    b.Property<long>("MeterMeasurementTypeId");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("MeterMeasurementTypeId");

                    b.ToTable("MeterMeasurements");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.MeterMeasurementType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long?>("AuthorId");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.Property<long>("PaymentTypeId");

                    b.Property<string>("SystemName");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("PaymentTypeId");

                    b.ToTable("MeterMeasurementTypes");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.Payment", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("Amount");

                    b.Property<long?>("AuthorId");

                    b.Property<DateTime?>("Date");

                    b.Property<string>("Description");

                    b.Property<long>("PaymentTypeId");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("PaymentTypeId");

                    b.ToTable("Payments");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.PaymentType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long?>("AuthorId");

                    b.Property<string>("Company");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.Property<string>("SystemName");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.ToTable("PaymentTypes");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Email");

                    b.Property<string>("FirstName");

                    b.Property<bool>("IsActive");

                    b.Property<string>("LastName");

                    b.Property<string>("Login");

                    b.Property<string>("PasswordHash");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.UserSettings", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("DisplayMeasurementNotification");

                    b.Property<string>("MeasurementsEmailToSend");

                    b.Property<long>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserSettings");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.UserToken", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("ActiveTo");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<string>("Token");

                    b.Property<long>("UserId");

                    b.Property<long>("UserTokenTypeId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.HasIndex("UserTokenTypeId");

                    b.ToTable("UserTokens");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.UserTokenType", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("UserTokenTypes");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.MeterMeasurement", b =>
                {
                    b.HasOne("MAS.Payments.DataBase.User", "Author")
                        .WithMany("Measurements")
                        .HasForeignKey("AuthorId");

                    b.HasOne("MAS.Payments.DataBase.MeterMeasurementType", "MeasurementType")
                        .WithMany("MeterMeasurements")
                        .HasForeignKey("MeterMeasurementTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MAS.Payments.DataBase.MeterMeasurementType", b =>
                {
                    b.HasOne("MAS.Payments.DataBase.User", "Author")
                        .WithMany("MeasurementTypes")
                        .HasForeignKey("AuthorId");

                    b.HasOne("MAS.Payments.DataBase.PaymentType", "PaymentType")
                        .WithMany("MeasurementTypes")
                        .HasForeignKey("PaymentTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MAS.Payments.DataBase.Payment", b =>
                {
                    b.HasOne("MAS.Payments.DataBase.User", "Author")
                        .WithMany("Payments")
                        .HasForeignKey("AuthorId");

                    b.HasOne("MAS.Payments.DataBase.PaymentType", "PaymentType")
                        .WithMany("Payments")
                        .HasForeignKey("PaymentTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MAS.Payments.DataBase.PaymentType", b =>
                {
                    b.HasOne("MAS.Payments.DataBase.User", "Author")
                        .WithMany("PaymentTypes")
                        .HasForeignKey("AuthorId");
                });

            modelBuilder.Entity("MAS.Payments.DataBase.UserSettings", b =>
                {
                    b.HasOne("MAS.Payments.DataBase.User", "User")
                        .WithOne("UserSettings")
                        .HasForeignKey("MAS.Payments.DataBase.UserSettings", "UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MAS.Payments.DataBase.UserToken", b =>
                {
                    b.HasOne("MAS.Payments.DataBase.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MAS.Payments.DataBase.UserTokenType", "TokenType")
                        .WithMany("UserTokens")
                        .HasForeignKey("UserTokenTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}

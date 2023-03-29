import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductApi } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/productService/product.service';

@Component({
  selector: 'app-seller-view',
  templateUrl: './seller-view.component.html',
  styleUrls: ['./seller-view.component.scss']
})
export class SellerViewComponent implements OnInit {

  public product: ProductApi | any = {};
  public amountProduct: number = 0;
  public amountProduct2: number = 0;

  public amountProductCtrl: FormControl = new FormControl('', [Validators.minLength(0), Validators.maxLength(5), Validators.required,
  Validators.required, Validators.pattern("^[1-9]$")]);

  public amountProductCtrl2: FormControl = new FormControl('', [Validators.minLength(0), Validators.maxLength(5), Validators.required,
    Validators.required, Validators.pattern("^[1-9]$")]);

  // Angular material table with pagination
  displayedColumns: string[] = ['Codigo', 'Cantidad', 'CortaFecha', '_id',];
  dataSource = new MatTableDataSource<ProductApi>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private productService: ProductService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  //Buscador
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Buscar datos en api conectada a la base de datos atlas mongodb 
  getAllProducts() {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => console.info("Realizado con exito")
    })
  }

  //CORREGIR NOMBRES
  getAllProductsFunction(id: string, sell: number) {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => this.updateProduct(id, sell)
    })
  }

  //CORREGIR NOMBRE
  getAllProductsFunction2(id: string, sell: number) {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      },
      complete: () => this.updateProductCortaFecha(id, sell)
    })
  }

  //REFRESCAR INFORMACIÓN
  refresh(): void { window.location.reload(); }

  //actualizar
  updateProduct(id: string, sell: number) {
    let productAux: ProductApi = this.dataSource.data.filter((obj) => obj._id === id)[0];
    if (productAux.Cantidad < sell) {
      alert("La cantidad vendida supera a la de la bodega")
    } else {
      productAux.Cantidad = productAux.Cantidad - sell;
      this.updateProductById(productAux);
    }
  }

  //actualizar Corta Fecha
  updateProductCortaFecha(id: string, sell: number) {
    let productAux: ProductApi = this.dataSource.data.filter((obj) => obj._id === id)[0];
    if (productAux.CortaFecha < sell) {
      alert("La cantidad vendida supera a la de la bodega")
    } else {
      productAux.CortaFecha = productAux.CortaFecha - sell;
      this.updateProductById(productAux);
    }
  }

  //actualizar
  updateProductById(productAux: ProductApi) {
    this.productService.updateProduct(productAux).subscribe({
      next: (res) => {
        this.product = {};
        this.amountProduct = 0;
        this.ngOnInit();
        console.info(res)
      },
      error: (err) => {
        console.error(`Hemos tenido un error: ${err}`)
      }
    });
  }

  doLogout() {
    this.router.navigateByUrl('login');
  }

  openModal(content: any) {
    this.modalService.open(content, { size: 'xl' },
      // { ariaLabelledBy: 'modal-basic-title' }
    ).result.then(
      (result) => {

      },
      (reason) => {
        this.ngOnInit();
      },
    );
  }


}
